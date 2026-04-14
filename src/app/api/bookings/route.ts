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

    const { trainer_id, date, start_time, end_time, session_type, location_type, location_address } = await request.json();

    if (!trainer_id || !date || !start_time || !end_time) {
      return NextResponse.json({ error: 'trainer_id, date, start_time, and end_time are required' }, { status: 400 });
    }

    // Get client record
    const client = await sql`SELECT id FROM clients WHERE user_id = ${session.user_id}`;
    if (client.length === 0) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 });
    }

    // Get trainer details for pricing
    const trainer = await sql`
      SELECT t.*, u.name as trainer_name, u.email as trainer_email
      FROM trainers t
      JOIN users u ON u.id = t.user_id
      WHERE t.id = ${trainer_id}
    `;
    if (trainer.length === 0) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }

    // Calculate session duration and amount
    const startParts = start_time.split(':').map(Number);
    const endParts = end_time.split(':').map(Number);
    const durationHours = (endParts[0] + endParts[1] / 60) - (startParts[0] + startParts[1] / 60);
    const amountCents = Math.round(trainer[0].hourly_rate * 100 * durationHours);
    const platformFeeCents = Math.round(amountCents * 0.15);
    const trainerPayoutCents = amountCents - platformFeeCents;

    // Create Stripe Checkout session
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' });
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency: 'aud',
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: `PT Session with ${trainer[0].trainer_name}`,
              description: `${session_type || 'Training'} session on ${date} from ${start_time} to ${end_time}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      ...(trainer[0].stripe_account_id
        ? {
            payment_intent_data: {
              application_fee_amount: platformFeeCents,
              transfer_data: {
                destination: trainer[0].stripe_account_id,
              },
            },
          }
        : {}),
      success_url: `${appUrl}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/trainers/${trainer_id}?booking=cancelled`,
      metadata: {
        trainer_id: trainer_id.toString(),
        client_id: client[0].id.toString(),
        date,
        start_time,
        end_time,
      },
    });

    // Save booking
    const booking = await sql`
      INSERT INTO bookings (client_id, trainer_id, date, start_time, end_time, session_type, location_type, location_address, status, stripe_session_id, amount_cents, trainer_payout_cents, platform_fee_cents)
      VALUES (${client[0].id}, ${trainer_id}, ${date}, ${start_time}, ${end_time}, ${session_type || null}, ${location_type || null}, ${location_address || null}, 'pending', ${checkoutSession.id}, ${amountCents}, ${trainerPayoutCents}, ${platformFeeCents})
      RETURNING *
    `;

    return NextResponse.json({ url: checkoutSession.url, booking: booking[0] });
  } catch (error) {
    console.error('[Bookings POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
