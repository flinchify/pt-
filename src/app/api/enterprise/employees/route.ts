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

    const employees = await sql`
      SELECT ee.*, u.name, u.email
      FROM enterprise_employees ee
      LEFT JOIN users u ON u.id = ee.user_id
      WHERE ee.enterprise_id = ${enterprise[0].id}
      ORDER BY ee.created_at DESC
    `;

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('[Enterprise Employees GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const { email, employee_id_ext, department, booking_limit } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find or create user
    let userRows = await sql`SELECT id FROM users WHERE email = ${email}`;
    let userId: number | null = null;

    if (userRows.length > 0) {
      userId = userRows[0].id;
    }

    const employee = await sql`
      INSERT INTO enterprise_employees (enterprise_id, user_id, employee_id_ext, department, booking_limit)
      VALUES (${enterprise[0].id}, ${userId}, ${employee_id_ext || null}, ${department || null}, ${booking_limit || 8})
      RETURNING *
    `;

    return NextResponse.json(employee[0], { status: 201 });
  } catch (error) {
    console.error('[Enterprise Employees POST] Error:', error);
    return NextResponse.json({ error: 'Failed to add employee' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const { employee_id } = await request.json();
    if (!employee_id) {
      return NextResponse.json({ error: 'employee_id is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM enterprise_employees
      WHERE id = ${employee_id} AND enterprise_id = ${enterprise[0].id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Enterprise Employees DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to remove employee' }, { status: 500 });
  }
}
