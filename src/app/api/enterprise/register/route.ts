import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    const sql = getDb();

    const {
      company_name,
      abn,
      industry,
      employee_count,
      contact_name,
      contact_email,
      contact_phone,
      plan,
    } = await request.json();

    if (!company_name || !contact_email || !contact_name) {
      return NextResponse.json({ error: 'company_name, contact_name, and contact_email are required' }, { status: 400 });
    }

    // Create or get user for enterprise
    let userRows = await sql`SELECT id FROM users WHERE email = ${contact_email}`;
    let userId: number;

    if (userRows.length === 0) {
      const inserted = await sql`
        INSERT INTO users (email, name, role)
        VALUES (${contact_email}, ${contact_name}, 'enterprise')
        RETURNING id
      `;
      userId = inserted[0].id;
    } else {
      userId = userRows[0].id;
      await sql`UPDATE users SET role = 'enterprise', updated_at = NOW() WHERE id = ${userId}`;
    }

    const enterprise = await sql`
      INSERT INTO enterprises (user_id, company_name, abn, industry, employee_count, contact_name, contact_email, contact_phone, plan)
      VALUES (${userId}, ${company_name}, ${abn || null}, ${industry || null}, ${employee_count || null}, ${contact_name}, ${contact_email}, ${contact_phone || null}, ${plan || 'enterprise'})
      RETURNING *
    `;

    return NextResponse.json(enterprise[0], { status: 201 });
  } catch (error) {
    console.error('[Enterprise Register] Error:', error);
    return NextResponse.json({ error: 'Failed to register enterprise' }, { status: 500 });
  }
}
