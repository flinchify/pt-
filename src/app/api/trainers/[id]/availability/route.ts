import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    const sql = getDb();
    const { id } = await params;
    const trainerId = parseInt(id);

    const slots = await sql`
      SELECT s.*, g.name as gym_name
      FROM availability_slots s
      LEFT JOIN gyms g ON g.id = s.gym_id
      WHERE s.trainer_id = ${trainerId}
      ORDER BY s.day_of_week, s.start_time
    `;

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('[Availability GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();
    const { id } = await params;
    const trainerId = parseInt(id);

    // Verify ownership
    const trainer = await sql`SELECT user_id FROM trainers WHERE id = ${trainerId}`;
    if (trainer.length === 0 || trainer[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { day_of_week, start_time, end_time, location_type, gym_id, address } = await request.json();

    if (day_of_week === undefined || !start_time || !end_time) {
      return NextResponse.json({ error: 'day_of_week, start_time, and end_time are required' }, { status: 400 });
    }

    const slot = await sql`
      INSERT INTO availability_slots (trainer_id, day_of_week, start_time, end_time, location_type, gym_id, address)
      VALUES (${trainerId}, ${day_of_week}, ${start_time}, ${end_time}, ${location_type || 'gym'}, ${gym_id || null}, ${address || null})
      RETURNING *
    `;

    return NextResponse.json(slot[0], { status: 201 });
  } catch (error) {
    console.error('[Availability POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();
    const { id } = await params;
    const trainerId = parseInt(id);

    // Verify ownership
    const trainer = await sql`SELECT user_id FROM trainers WHERE id = ${trainerId}`;
    if (trainer.length === 0 || trainer[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { slot_id } = await request.json();
    if (!slot_id) {
      return NextResponse.json({ error: 'slot_id is required' }, { status: 400 });
    }

    await sql`DELETE FROM availability_slots WHERE id = ${slot_id} AND trainer_id = ${trainerId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Availability DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}
