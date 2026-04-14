import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'enterprise') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();

    const enterprise = await sql`SELECT id FROM enterprises WHERE user_id = ${session.user_id}`;
    if (enterprise.length === 0) {
      return NextResponse.json({ error: 'Enterprise not found' }, { status: 404 });
    }

    // Get all employee user IDs
    const employees = await sql`
      SELECT ee.id as emp_id, ee.user_id, ee.department, ee.employee_id_ext, ee.bookings_used, ee.booking_limit, u.name, u.email
      FROM enterprise_employees ee
      LEFT JOIN users u ON u.id = ee.user_id
      WHERE ee.enterprise_id = ${enterprise[0].id}
    `;

    const employeeUserIds = employees
      .filter((e: Record<string, unknown>) => e.user_id != null)
      .map((e: Record<string, unknown>) => e.user_id);

    // Get bookings for these users
    let bookings: Record<string, unknown>[] = [];
    if (employeeUserIds.length > 0) {
      bookings = await sql`
        SELECT b.*, c.user_id as client_user_id, u.name as client_name, ee.department
        FROM bookings b
        JOIN clients c ON c.id = b.client_id
        JOIN users u ON u.id = c.user_id
        LEFT JOIN enterprise_employees ee ON ee.user_id = c.user_id AND ee.enterprise_id = ${enterprise[0].id}
        WHERE c.user_id = ANY(${employeeUserIds})
        ORDER BY b.date DESC
      `;
    }

    // Group by department
    const byDepartment: Record<string, unknown[]> = {};
    for (const booking of bookings) {
      const dept = (booking.department as string) || 'Unassigned';
      if (!byDepartment[dept]) byDepartment[dept] = [];
      byDepartment[dept].push(booking);
    }

    return NextResponse.json({
      employees,
      bookings,
      by_department: byDepartment,
      total_bookings: bookings.length,
    });
  } catch (error) {
    console.error('[Enterprise Bookings GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch usage reports' }, { status: 500 });
  }
}
