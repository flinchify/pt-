import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    await ensureTables();
    const sql = getDb();

    await sql`
      INSERT INTO contact_submissions (name, email, phone, subject, message)
      VALUES (${name}, ${email}, ${phone || null}, ${subject || null}, ${message})
    `;

    // Send notification email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'AnywherePT <noreply@anywherept.com.au>',
          to: process.env.ADMIN_EMAIL || 'admin@anywherept.com.au',
          subject: `New Contact Form: ${subject || 'No Subject'}`,
          html: `
            <h2>New Contact Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });
      } catch (emailError) {
        console.error('[Contact] Email notification failed:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact] Error:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}
