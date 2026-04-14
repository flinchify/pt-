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

    const [users, trainers, gyms, bookings, revenue] = await Promise.all([
      sql`SELECT COUNT(*) as total FROM users`,
      sql`SELECT COUNT(*) as total FROM trainers`,
      sql`SELECT COUNT(*) as total FROM gyms`,
      sql`SELECT COUNT(*) as total FROM bookings`,
      sql`SELECT COALESCE(SUM(amount_cents), 0) as total, COALESCE(SUM(platform_fee_cents), 0) as platform_fees FROM bookings WHERE status IN ('confirmed', 'completed')`,
    ]);

    return NextResponse.json({
      total_users: parseInt(users[0].total),
      total_trainers: parseInt(trainers[0].total),
      total_gyms: parseInt(gyms[0].total),
      total_bookings: parseInt(bookings[0].total),
      total_revenue_cents: parseInt(revenue[0].total),
      platform_fees_cents: parseInt(revenue[0].platform_fees),
    });
  } catch (error) {
    console.error('[Admin Stats] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
