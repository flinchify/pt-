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

    const rows = await sql`
      SELECT g.*, u.name as owner_name
      FROM gyms g
      JOIN users u ON u.id = g.user_id
      WHERE g.id = ${gymId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[Gym GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch gym' }, { status: 500 });
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
    const gymId = parseInt(id);

    const gym = await sql`SELECT user_id FROM gyms WHERE id = ${gymId}`;
    if (gym.length === 0) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }
    if (gym[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, address, suburb, state, postcode, phone, email, website, logo_url, amenities, operating_hours } = body;

    const updated = await sql`
      UPDATE gyms SET
        name = COALESCE(${name ?? null}, name),
        address = COALESCE(${address ?? null}, address),
        suburb = COALESCE(${suburb ?? null}, suburb),
        state = COALESCE(${state ?? null}, state),
        postcode = COALESCE(${postcode ?? null}, postcode),
        phone = COALESCE(${phone ?? null}, phone),
        email = COALESCE(${email ?? null}, email),
        website = COALESCE(${website ?? null}, website),
        logo_url = COALESCE(${logo_url ?? null}, logo_url),
        amenities = COALESCE(${amenities ?? null}, amenities),
        operating_hours = COALESCE(${operating_hours ? JSON.stringify(operating_hours) : null}, operating_hours),
        updated_at = NOW()
      WHERE id = ${gymId}
      RETURNING *
    `;

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[Gym PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update gym' }, { status: 500 });
  }
}
