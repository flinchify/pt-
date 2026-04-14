import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await ensureTables();
    const sql = getDb();

    // Check if already subscribed
    const existing = await sql`SELECT id FROM newsletter_subscribers WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    await sql`INSERT INTO newsletter_subscribers (email) VALUES (${email})`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Newsletter] Error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
