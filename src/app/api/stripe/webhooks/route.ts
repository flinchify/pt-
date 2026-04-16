import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { sendBookingConfirmationToClient, sendBookingNotificationToTrainer } from '@/lib/emails';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' });
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('[Stripe Webhook] Signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    await ensureTables();
    const sql = getDb();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update booking status to confirmed and send emails
        if (session.id) {
          await sql`
            UPDATE bookings SET status = 'confirmed', updated_at = NOW()
            WHERE stripe_session_id = ${session.id}
          `;

          // Send confirmation emails
          try {
            const bookingRows = await sql`
              SELECT b.*, u_client.name as client_name, u_client.email as client_email,
                     u_trainer.name as trainer_name, u_trainer.email as trainer_email
              FROM bookings b
              JOIN clients c ON c.id = b.client_id
              JOIN users u_client ON u_client.id = c.user_id
              JOIN trainers t ON t.id = b.trainer_id
              JOIN users u_trainer ON u_trainer.id = t.user_id
              WHERE b.stripe_session_id = ${session.id}
            `;
            if (bookingRows.length > 0) {
              const b = bookingRows[0];
              const emailData = {
                clientName: b.client_name,
                clientEmail: b.client_email,
                trainerName: b.trainer_name,
                trainerEmail: b.trainer_email,
                date: b.date,
                startTime: b.start_time,
                endTime: b.end_time,
                sessionType: b.session_type || 'Personal Training',
                locationAddress: b.location_address || 'TBD',
                amountCents: b.amount_cents,
              };
              await Promise.all([
                sendBookingConfirmationToClient(emailData),
                sendBookingNotificationToTrainer(emailData),
              ]);
            }
          } catch (emailErr) {
            console.error('[Stripe Webhook] Email send error:', emailErr);
          }
        }

        // Handle subscription checkout
        if (session.mode === 'subscription' && session.subscription) {
          const userId = session.metadata?.user_id;
          const plan = session.metadata?.plan;
          if (userId) {
            await sql`
              UPDATE subscriptions SET
                stripe_subscription_id = ${session.subscription.toString()},
                status = 'active',
                updated_at = NOW()
              WHERE user_id = ${parseInt(userId)} AND plan = ${plan || 'committed'}
              AND status = 'active'
            `;
          }
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null; period_start?: number; period_end?: number };
        if (invoice.subscription) {
          await sql`
            UPDATE subscriptions SET
              status = 'active',
              current_period_start = ${new Date((invoice.period_start || 0) * 1000).toISOString()},
              current_period_end = ${new Date((invoice.period_end || 0) * 1000).toISOString()},
              updated_at = NOW()
            WHERE stripe_subscription_id = ${invoice.subscription.toString()}
          `;
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription & { current_period_start?: number; current_period_end?: number };
        await sql`
          UPDATE subscriptions SET
            status = ${subscription.status === 'active' ? 'active' : subscription.status === 'past_due' ? 'past_due' : 'cancelled'},
            current_period_start = ${new Date((subscription.current_period_start || 0) * 1000).toISOString()},
            current_period_end = ${new Date((subscription.current_period_end || 0) * 1000).toISOString()},
            updated_at = NOW()
          WHERE stripe_subscription_id = ${subscription.id}
        `;
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await sql`
          UPDATE subscriptions SET status = 'cancelled', updated_at = NOW()
          WHERE stripe_subscription_id = ${subscription.id}
        `;
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        const chargesEnabled = account.charges_enabled;
        await sql`
          UPDATE trainers SET
            verified = ${chargesEnabled || false},
            updated_at = NOW()
          WHERE stripe_account_id = ${account.id}
        `;
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
