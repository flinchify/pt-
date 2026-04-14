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

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const bookings = await sql`
      SELECT b.*, t.id as trainer_profile_id, t.photo_url as trainer_photo,
        t.specialisations, u.name as trainer_name, u.email as trainer_email
      FROM bookings b
      JOIN trainers t ON t.id = b.trainer_id
      JOIN users u ON u.id = t.user_id
      WHERE b.client_id = ${client[0].id}
      ORDER BY b.date DESC, b.start_time DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) as total FROM bookings WHERE client_id = ${client[0].id}
    `;

    return NextResponse.json({
      bookings,
      total: parseInt(countResult[0].total),
      page,
      limit,
    });
  } catch (error) {
    console.error('[Client Bookings GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
