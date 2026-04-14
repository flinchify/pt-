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
    const gymId = parseInt(id);

    const trainers = await sql`
      SELECT t.*, u.name, u.email, u.avatar_url, gt.status as gym_status
      FROM gym_trainers gt
      JOIN trainers t ON t.id = gt.trainer_id
      JOIN users u ON u.id = t.user_id
      WHERE gt.gym_id = ${gymId} AND gt.status = 'active'
      ORDER BY u.name
    `;

    return NextResponse.json({ trainers });
  } catch (error) {
    console.error('[Gym Trainers GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch gym trainers' }, { status: 500 });
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
    const gymId = parseInt(id);

    // Verify gym ownership
    const gym = await sql`SELECT user_id FROM gyms WHERE id = ${gymId}`;
    if (gym.length === 0) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }
    if (gym[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { trainer_id } = await request.json();
    if (!trainer_id) {
      return NextResponse.json({ error: 'trainer_id is required' }, { status: 400 });
    }

    // Check if already linked
    const existing = await sql`
      SELECT id FROM gym_trainers WHERE gym_id = ${gymId} AND trainer_id = ${trainer_id}
    `;
    if (existing.length > 0) {
      await sql`UPDATE gym_trainers SET status = 'pending' WHERE id = ${existing[0].id}`;
      return NextResponse.json({ success: true, message: 'Invite resent' });
    }

    await sql`
      INSERT INTO gym_trainers (gym_id, trainer_id, status)
      VALUES (${gymId}, ${trainer_id}, 'pending')
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[Gym Trainers POST] Error:', error);
    return NextResponse.json({ error: 'Failed to add trainer' }, { status: 500 });
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
    const gymId = parseInt(id);

    const gym = await sql`SELECT user_id FROM gyms WHERE id = ${gymId}`;
    if (gym.length === 0 || gym[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { trainer_id } = await request.json();
    if (!trainer_id) {
      return NextResponse.json({ error: 'trainer_id is required' }, { status: 400 });
    }

    await sql`
      UPDATE gym_trainers SET status = 'removed'
      WHERE gym_id = ${gymId} AND trainer_id = ${trainer_id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Gym Trainers DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to remove trainer' }, { status: 500 });
  }
}
