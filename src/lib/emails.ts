import { Resend } from 'resend';

const FROM = 'AnywherePT <noreply@anywherept.com.au>';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

interface BookingDetails {
  clientName: string;
  clientEmail: string;
  trainerName: string;
  trainerEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  locationAddress: string;
  amountCents: number;
}

export async function sendBookingConfirmationToClient(booking: BookingDetails) {
  const resend = getResend();
  if (!resend) {
    console.log('[Email] Resend not configured, skipping client booking confirmation');
    return;
  }

  const formattedDate = new Date(booking.date).toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  await resend.emails.send({
    from: FROM,
    to: booking.clientEmail,
    subject: `Booking Confirmed - ${booking.trainerName} on ${formattedDate}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #0A6847; font-size: 24px; margin: 0;">AnywherePT</h1>
        </div>
        <div style="background: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #166534; font-size: 20px; margin: 0 0 8px;">Booking Confirmed</h2>
          <p style="color: #4b5563; margin: 0;">Your session has been booked successfully.</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Trainer</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right; font-weight: 600;">${booking.trainerName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Date</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Time</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">${booking.startTime} - ${booking.endTime}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Session Type</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">${booking.sessionType}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Location</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">${booking.locationAddress}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Amount Paid</td>
            <td style="padding: 12px 0; color: #0A6847; font-size: 16px; text-align: right; font-weight: 700;">$${(booking.amountCents / 100).toFixed(2)}</td>
          </tr>
        </table>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://anywherept.com.au/dashboard/bookings" style="display: inline-block; background: #0A6847; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View Booking</a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          Free cancellation up to 24 hours before your session.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          AnywherePT | anywherept.com.au | support@anywherept.com.au
        </p>
      </div>
    `,
  });
}

export async function sendBookingNotificationToTrainer(booking: BookingDetails) {
  const resend = getResend();
  if (!resend) {
    console.log('[Email] Resend not configured, skipping trainer booking notification');
    return;
  }

  const formattedDate = new Date(booking.date).toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  await resend.emails.send({
    from: FROM,
    to: booking.trainerEmail,
    subject: `New Booking - ${booking.clientName} on ${formattedDate}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #0A6847; font-size: 24px; margin: 0;">AnywherePT</h1>
        </div>
        <div style="background: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #166534; font-size: 20px; margin: 0 0 8px;">New Booking</h2>
          <p style="color: #4b5563; margin: 0;">You have a new confirmed session.</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Client</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right; font-weight: 600;">${booking.clientName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Date</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Time</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">${booking.startTime} - ${booking.endTime}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Session Type</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">${booking.sessionType}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Location</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; text-align: right;">${booking.locationAddress}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Your Payout</td>
            <td style="padding: 12px 0; color: #0A6847; font-size: 16px; text-align: right; font-weight: 700;">$${(booking.amountCents * 0.85 / 100).toFixed(2)}</td>
          </tr>
        </table>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://anywherept.com.au/trainer/dashboard/calendar" style="display: inline-block; background: #0A6847; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View Calendar</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          AnywherePT | anywherept.com.au | support@anywherept.com.au
        </p>
      </div>
    `,
  });
}
