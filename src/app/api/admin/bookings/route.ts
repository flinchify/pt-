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
    const status = searchParams.get('status');
    const trainerId = searchParams.get('trainer_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Fetch all bookings and filter in app code for neon tagged template compatibility
    const allBookings = await sql`
      SELECT b.*,
        tu.name as trainer_name, cu.name as client_name
      FROM bookings b
      JOIN trainers t ON t.id = b.trainer_id
      JOIN users tu ON tu.id = t.user_id
      JOIN clients c ON c.id = b.client_id
      JOIN users cu ON cu.id = c.user_id
      ORDER BY b.date DESC, b.start_time DESC
    `;

    let filtered = allBookings;

    if (status) {
      filtered = filtered.filter((b: Record<string, unknown>) => b.status === status);
    }
    if (trainerId) {
      filtered = filtered.filter((b: Record<string, unknown>) => Number(b.trainer_id) === parseInt(trainerId));
    }
    if (dateFrom) {
      filtered = filtered.filter((b: Record<string, unknown>) => String(b.date) >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((b: Record<string, unknown>) => String(b.date) <= dateTo);
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      bookings: paginated,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('[Admin Bookings GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
