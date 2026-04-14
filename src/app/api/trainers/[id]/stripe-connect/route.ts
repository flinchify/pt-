import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Stripe from 'stripe';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();
    const { id } = await params;
    const trainerId = parseInt(id);

    const trainer = await sql`SELECT user_id, stripe_account_id FROM trainers WHERE id = ${trainerId}`;
    if (trainer.length === 0 || trainer[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' });
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    let accountId = trainer[0].stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'AU',
        email: session.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      accountId = account.id;

      await sql`UPDATE trainers SET stripe_account_id = ${accountId} WHERE id = ${trainerId}`;
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl}/dashboard/trainer/stripe?refresh=true`,
      return_url: `${appUrl}/dashboard/trainer/stripe?success=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('[Stripe Connect] Error:', error);
    return NextResponse.json({ error: 'Failed to create Stripe onboarding link' }, { status: 500 });
  }
}
