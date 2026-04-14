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

    // Total revenue
    const totals = await sql`
      SELECT
        COALESCE(SUM(amount_cents), 0) as total_revenue,
        COALESCE(SUM(platform_fee_cents), 0) as total_platform_fees,
        COALESCE(SUM(trainer_payout_cents), 0) as total_trainer_payouts
      FROM bookings
      WHERE status IN ('confirmed', 'completed')
    `;

    // Monthly breakdown
    const monthly = await sql`
      SELECT
        TO_CHAR(date, 'YYYY-MM') as month,
        COUNT(*) as booking_count,
        COALESCE(SUM(amount_cents), 0) as revenue,
        COALESCE(SUM(platform_fee_cents), 0) as platform_fees,
        COALESCE(SUM(trainer_payout_cents), 0) as trainer_payouts
      FROM bookings
      WHERE status IN ('confirmed', 'completed')
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `;

    return NextResponse.json({
      totals: {
        total_revenue_cents: parseInt(totals[0].total_revenue),
        total_platform_fees_cents: parseInt(totals[0].total_platform_fees),
        total_trainer_payouts_cents: parseInt(totals[0].total_trainer_payouts),
      },
      monthly,
    });
  } catch (error) {
    console.error('[Admin Revenue] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}
