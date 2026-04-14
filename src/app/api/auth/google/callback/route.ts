import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=no_code`);
  }

  try {
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(`${appUrl}/login?error=token_exchange`);
    }

    // Get user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    if (!profile.email) {
      return NextResponse.redirect(`${appUrl}/login?error=no_email`);
    }

    await ensureTables();
    const sql = getDb();

    // Upsert user
    const existing = await sql`SELECT id, role FROM users WHERE email = ${profile.email}`;
    let userId: number;
    let role: string;

    if (existing.length > 0) {
      userId = existing[0].id;
      role = existing[0].role;
      await sql`
        UPDATE users SET
          name = COALESCE(${profile.name}, name),
          avatar_url = COALESCE(${profile.picture}, avatar_url),
          google_id = ${profile.id},
          updated_at = NOW()
        WHERE id = ${userId}
      `;
    } else {
      const inserted = await sql`
        INSERT INTO users (email, name, avatar_url, google_id, role)
        VALUES (${profile.email}, ${profile.name}, ${profile.picture}, ${profile.id}, 'client')
        RETURNING id, role
      `;
      userId = inserted[0].id;
      role = inserted[0].role;

      // Create client record
      await sql`INSERT INTO clients (user_id) VALUES (${userId})`;
    }

    // Create session
    const sessionId = await createSession(userId, profile.email);

    const response = NextResponse.redirect(`${appUrl}/dashboard`);
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Google Callback] Error:', error);
    return NextResponse.redirect(`${appUrl}/login?error=server`);
  }
}
