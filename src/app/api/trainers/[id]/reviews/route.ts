import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    const sql = getDb();
    const { id } = await params;
    const trainerId = parseInt(id);
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const reviews = await sql`
      SELECT r.*, u.name as client_name, u.avatar_url as client_avatar
      FROM reviews r
      JOIN clients c ON c.id = r.client_id
      JOIN users u ON u.id = c.user_id
      WHERE r.trainer_id = ${trainerId}
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) as total FROM reviews WHERE trainer_id = ${trainerId}
    `;

    const total = parseInt(countResult[0].total);

    return NextResponse.json({
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[Reviews GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
