import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();

    const sub = await sql`
      SELECT * FROM subscriptions
      WHERE user_id = ${session.user_id} AND status = 'active'
      ORDER BY created_at DESC LIMIT 1
    `;

    if (sub.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    if (sub[0].stripe_subscription_id) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' });

      try {
        await stripe.subscriptions.cancel(sub[0].stripe_subscription_id);
      } catch (stripeError) {
        console.error('[Subscription Cancel] Stripe error:', stripeError);
        // Continue to update local status even if Stripe fails
      }
    }

    await sql`
      UPDATE subscriptions SET status = 'cancelled', updated_at = NOW()
      WHERE id = ${sub[0].id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Subscription Cancel] Error:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
