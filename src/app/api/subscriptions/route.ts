import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Stripe from 'stripe';

const PLANS: Record<string, { price_cents: number; name: string }> = {
  committed: { price_cents: 14900, name: 'Committed Plan' },
  unlimited: { price_cents: 24900, name: 'Unlimited Plan' },
};

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();

    const rows = await sql`
      SELECT * FROM subscriptions
      WHERE user_id = ${session.user_id}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    return NextResponse.json({ subscription: rows[0] });
  } catch (error) {
    console.error('[Subscriptions GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await request.json();
    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid plan. Must be committed or unlimited' }, { status: 400 });
    }

    await ensureTables();
    const sql = getDb();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' });
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    // Create or get Stripe customer
    const existingSub = await sql`
      SELECT stripe_subscription_id FROM subscriptions
      WHERE user_id = ${session.user_id} AND status = 'active'
    `;
    if (existingSub.length > 0) {
      return NextResponse.json({ error: 'You already have an active subscription' }, { status: 400 });
    }

    // Create a Stripe price on the fly (in production, use pre-created prices)
    const product = await stripe.products.create({
      name: PLANS[plan].name,
      metadata: { plan },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: PLANS[plan].price_cents,
      currency: 'aud',
      recurring: { interval: 'month' },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${appUrl}/dashboard?subscription=success`,
      cancel_url: `${appUrl}/pricing?subscription=cancelled`,
      metadata: {
        user_id: session.user_id.toString(),
        plan,
      },
    });

    // Save subscription record (will be updated by webhook)
    await sql`
      INSERT INTO subscriptions (user_id, plan, stripe_subscription_id, status)
      VALUES (${session.user_id}, ${plan}, ${checkoutSession.subscription?.toString() || checkoutSession.id}, 'active')
    `;

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('[Subscriptions POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
