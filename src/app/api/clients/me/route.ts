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

    const rows = await sql`
      SELECT c.*, u.name, u.email, u.avatar_url, u.phone
      FROM clients c
      JOIN users u ON u.id = c.user_id
      WHERE c.user_id = ${session.user_id}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[Client GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch client profile' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();

    const body = await request.json();
    const { fitness_goals, current_weight, target_weight, height_cm, medical_notes, emergency_contact } = body;

    const updated = await sql`
      UPDATE clients SET
        fitness_goals = COALESCE(${fitness_goals ?? null}, fitness_goals),
        current_weight = COALESCE(${current_weight ?? null}, current_weight),
        target_weight = COALESCE(${target_weight ?? null}, target_weight),
        height_cm = COALESCE(${height_cm ?? null}, height_cm),
        medical_notes = COALESCE(${medical_notes ?? null}, medical_notes),
        emergency_contact = COALESCE(${emergency_contact ? JSON.stringify(emergency_contact) : null}, emergency_contact),
        updated_at = NOW()
      WHERE user_id = ${session.user_id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[Client PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update client profile' }, { status: 500 });
  }
}
