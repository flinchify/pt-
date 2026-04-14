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

    const goals = await sql`
      SELECT * FROM client_goals
      WHERE client_id = ${client[0].id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('[Goals GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
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

    const { title, description, target_value, current_value, unit, target_date } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const goal = await sql`
      INSERT INTO client_goals (client_id, title, description, target_value, current_value, unit, target_date)
      VALUES (${client[0].id}, ${title}, ${description || null}, ${target_value || null}, ${current_value || 0}, ${unit || null}, ${target_date || null})
      RETURNING *
    `;

    return NextResponse.json(goal[0], { status: 201 });
  } catch (error) {
    console.error('[Goals POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
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

    const client = await sql`SELECT id FROM clients WHERE user_id = ${session.user_id}`;
    if (client.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const { id, title, description, target_value, current_value, unit, target_date, completed } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Goal id is required' }, { status: 400 });
    }

    const updated = await sql`
      UPDATE client_goals SET
        title = COALESCE(${title ?? null}, title),
        description = COALESCE(${description ?? null}, description),
        target_value = COALESCE(${target_value ?? null}, target_value),
        current_value = COALESCE(${current_value ?? null}, current_value),
        unit = COALESCE(${unit ?? null}, unit),
        target_date = COALESCE(${target_date ?? null}, target_date),
        completed = COALESCE(${completed ?? null}, completed),
        updated_at = NOW()
      WHERE id = ${id} AND client_id = ${client[0].id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[Goals PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Goal id is required' }, { status: 400 });
    }

    await sql`DELETE FROM client_goals WHERE id = ${id} AND client_id = ${client[0].id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Goals DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}
