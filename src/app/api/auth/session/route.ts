import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      id: session.id,
      user_id: session.user_id,
      email: session.email,
      role: session.role,
      name: session.name,
    });
  } catch (error) {
    console.error('[Session] Error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
