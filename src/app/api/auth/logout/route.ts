import { NextRequest, NextResponse } from 'next/server';
import { getSession, destroySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (session) {
      await destroySession(session.id);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Logout] Error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
