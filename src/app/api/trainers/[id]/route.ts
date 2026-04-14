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

    const rows = await sql`
      SELECT t.*, u.name, u.email, u.avatar_url,
        (SELECT COUNT(*) FROM reviews r WHERE r.trainer_id = t.id) as reviews_count,
        (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.trainer_id = t.id) as calculated_rating
      FROM trainers t
      JOIN users u ON u.id = t.user_id
      WHERE t.id = ${trainerId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }

    // Increment profile views
    await sql`UPDATE trainers SET profile_views = profile_views + 1 WHERE id = ${trainerId}`;

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[Trainer GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trainer' }, { status: 500 });
  }
}

export async function PATCH(
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
    const trainer = await sql`SELECT id, user_id FROM trainers WHERE id = ${trainerId}`;
    if (trainer.length === 0) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }
    if (trainer[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      bio,
      specialisations,
      experience_years,
      hourly_rate,
      session_types,
      travel_radius_km,
      home_suburb,
      state,
    } = body;

    const updated = await sql`
      UPDATE trainers SET
        bio = COALESCE(${bio ?? null}, bio),
        specialisations = COALESCE(${specialisations ?? null}, specialisations),
        experience_years = COALESCE(${experience_years ?? null}, experience_years),
        hourly_rate = COALESCE(${hourly_rate ?? null}, hourly_rate),
        session_types = COALESCE(${session_types ?? null}, session_types),
        travel_radius_km = COALESCE(${travel_radius_km ?? null}, travel_radius_km),
        home_suburb = COALESCE(${home_suburb ?? null}, home_suburb),
        state = COALESCE(${state ?? null}, state),
        updated_at = NOW()
      WHERE id = ${trainerId}
      RETURNING *
    `;

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[Trainer PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update trainer' }, { status: 500 });
  }
}
