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
    const status = request.nextUrl.searchParams.get('status');

    let trainers;

    if (status) {
      trainers = await sql`
        SELECT t.*, u.name, u.email, u.avatar_url
        FROM trainers t
        JOIN users u ON u.id = t.user_id
        WHERE t.status = ${status}
        ORDER BY t.created_at DESC
      `;
    } else {
      trainers = await sql`
        SELECT t.*, u.name, u.email, u.avatar_url
        FROM trainers t
        JOIN users u ON u.id = t.user_id
        ORDER BY t.created_at DESC
      `;
    }

    return NextResponse.json({ trainers });
  } catch (error) {
    console.error('[Admin Trainers GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trainers' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();

    const { trainer_id, status } = await request.json();

    if (!trainer_id || !status) {
      return NextResponse.json({ error: 'trainer_id and status are required' }, { status: 400 });
    }

    if (!['active', 'pending', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await sql`
      UPDATE trainers SET status = ${status}, updated_at = NOW()
      WHERE id = ${trainer_id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[Admin Trainers PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update trainer' }, { status: 500 });
  }
}
