import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();

    const client = await sql`SELECT id FROM clients WHERE user_id = ${session.user_id}`;
    if (client.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const entries = await sql`
      SELECT * FROM client_progress
      WHERE client_id = ${client[0].id}
      ORDER BY date DESC
    `;

    return NextResponse.json({ progress: entries });
  } catch (error) {
    console.error('[Progress GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();

    const client = await sql`SELECT id FROM clients WHERE user_id = ${session.user_id}`;
    if (client.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const { weight, body_fat_pct, measurements, notes } = await request.json();

    const entry = await sql`
      INSERT INTO client_progress (client_id, weight, body_fat_pct, measurements, notes)
      VALUES (${client[0].id}, ${weight || null}, ${body_fat_pct || null}, ${measurements ? JSON.stringify(measurements) : null}, ${notes || null})
      RETURNING *
    `;

    return NextResponse.json(entry[0], { status: 201 });
  } catch (error) {
    console.error('[Progress POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create progress entry' }, { status: 500 });
  }
}
