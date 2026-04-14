import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (session?.role === 'admin') return true;

  const cookieStore = await cookies();
  const adminSecret = cookieStore.get('admin_secret')?.value;
  return adminSecret === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();

    const gyms = await sql`
      SELECT g.*, u.name as owner_name, u.email as owner_email
      FROM gyms g
      JOIN users u ON u.id = g.user_id
      ORDER BY g.created_at DESC
    `;

    return NextResponse.json({ gyms });
  } catch (error) {
    console.error('[Admin Gyms GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch gyms' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();

    const { gym_id, verified } = await request.json();

    if (!gym_id || verified === undefined) {
      return NextResponse.json({ error: 'gym_id and verified are required' }, { status: 400 });
    }

    const updated = await sql`
      UPDATE gyms SET verified = ${verified}, updated_at = NOW()
      WHERE id = ${gym_id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[Admin Gyms PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update gym' }, { status: 500 });
  }
}
