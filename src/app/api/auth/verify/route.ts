import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { verifyAuthCode, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, code, role, name } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    await ensureTables();

    const valid = await verifyAuthCode(email, code);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
    }

    const sql = getDb();
    const userRole = role || 'client';

    // Upsert user
    const existing = await sql`SELECT id, role FROM users WHERE email = ${email}`;
    let userId: number;
    let finalRole: string;

    if (existing.length > 0) {
      userId = existing[0].id;
      finalRole = existing[0].role;
      if (name) {
        await sql`UPDATE users SET name = ${name}, updated_at = NOW() WHERE id = ${userId}`;
      }
    } else {
      const inserted = await sql`
        INSERT INTO users (email, name, role)
        VALUES (${email}, ${name || null}, ${userRole})
        RETURNING id, role
      `;
      userId = inserted[0].id;
      finalRole = inserted[0].role;
    }

    // Create role-specific records if new
    if (finalRole === 'trainer') {
      const trainerExists = await sql`SELECT id FROM trainers WHERE user_id = ${userId}`;
      if (trainerExists.length === 0) {
        const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
        await sql`
          INSERT INTO trainers (user_id, slug, status)
          VALUES (${userId}, ${slug}, 'pending')
        `;
      }
    } else if (finalRole === 'client') {
      const clientExists = await sql`SELECT id FROM clients WHERE user_id = ${userId}`;
      if (clientExists.length === 0) {
        await sql`INSERT INTO clients (user_id) VALUES (${userId})`;
      }
    }

    // Create session
    const sessionId = await createSession(userId, email);

    const response = NextResponse.json({
      success: true,
      role: finalRole,
      user_id: userId,
    });

    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Verify] Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
