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
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let users;
    let countResult;

    if (role) {
      users = await sql`
        SELECT id, email, name, phone, avatar_url, role, created_at
        FROM users WHERE role = ${role}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`SELECT COUNT(*) as total FROM users WHERE role = ${role}`;
    } else {
      users = await sql`
        SELECT id, email, name, phone, avatar_url, role, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`SELECT COUNT(*) as total FROM users`;
    }

    return NextResponse.json({
      users,
      total: parseInt(countResult[0].total),
      page,
      limit,
    });
  } catch (error) {
    console.error('[Admin Accounts] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
