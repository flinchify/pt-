import { NextRequest, NextResponse } from 'next/server';
import { ensureTables } from '@/lib/db';
import { generateAuthCode } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await ensureTables();
    const code = await generateAuthCode(email);

    // Send email if Resend API key exists
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'AnywherePT <noreply@anywherept.com.au>',
        to: email,
        subject: 'Your AnywherePT Login Code',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Your Login Code</h2>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${code}</p>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
          </div>
        `,
      });

      return NextResponse.json({ success: true });
    }

    // Dev mode: return code in response
    return NextResponse.json({ success: true, code });
  } catch (error) {
    console.error('[Login] Error:', error);
    return NextResponse.json({ error: 'Failed to send login code' }, { status: 500 });
  }
}
