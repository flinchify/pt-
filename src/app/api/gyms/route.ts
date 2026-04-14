import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await ensureTables();
    const sql = getDb();
    const searchParams = request.nextUrl.searchParams;
    const suburb = searchParams.get('suburb');
    const state = searchParams.get('state');

    let gyms;

    if (suburb && state) {
      gyms = await sql`
        SELECT g.*, u.name as owner_name
        FROM gyms g
        JOIN users u ON u.id = g.user_id
        WHERE LOWER(g.suburb) LIKE LOWER(${'%' + suburb + '%'}) AND g.state = ${state}
        ORDER BY g.name
      `;
    } else if (suburb) {
      gyms = await sql`
        SELECT g.*, u.name as owner_name
        FROM gyms g
        JOIN users u ON u.id = g.user_id
        WHERE LOWER(g.suburb) LIKE LOWER(${'%' + suburb + '%'})
        ORDER BY g.name
      `;
    } else if (state) {
      gyms = await sql`
        SELECT g.*, u.name as owner_name
        FROM gyms g
        JOIN users u ON u.id = g.user_id
        WHERE g.state = ${state}
        ORDER BY g.name
      `;
    } else {
      gyms = await sql`
        SELECT g.*, u.name as owner_name
        FROM gyms g
        JOIN users u ON u.id = g.user_id
        ORDER BY g.name
      `;
    }

    return NextResponse.json({ gyms });
  } catch (error) {
    console.error('[Gyms GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch gyms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'gym') {
      return NextResponse.json({ error: 'Only gym accounts can register gyms' }, { status: 403 });
    }

    await ensureTables();
    const sql = getDb();

    const body = await request.json();
    const { name, address, suburb, state, postcode, phone, email, website, logo_url, amenities, operating_hours } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const gym = await sql`
      INSERT INTO gyms (user_id, name, slug, address, suburb, state, postcode, phone, email, website, logo_url, amenities, operating_hours)
      VALUES (${session.user_id}, ${name}, ${slug}, ${address || null}, ${suburb || null}, ${state || null}, ${postcode || null}, ${phone || null}, ${email || null}, ${website || null}, ${logo_url || null}, ${amenities || null}, ${operating_hours ? JSON.stringify(operating_hours) : null})
      RETURNING *
    `;

    return NextResponse.json(gym[0], { status: 201 });
  } catch (error) {
    console.error('[Gyms POST] Error:', error);
    return NextResponse.json({ error: 'Failed to register gym' }, { status: 500 });
  }
}
