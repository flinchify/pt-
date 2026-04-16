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
    const body = await request.json();
    const { rating, comment, booking_id } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Get client record
    const clientRows = await sql`SELECT id FROM clients WHERE user_id = ${session.user_id}`;
    if (clientRows.length === 0) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 });
    }
    const clientId = clientRows[0].id;

    // Must have a completed booking with this trainer
    const bookingRows = await sql`
      SELECT id FROM bookings
      WHERE client_id = ${clientId} AND trainer_id = ${trainerId} AND status = 'completed'
      ${booking_id ? sql`AND id = ${booking_id}` : sql``}
      LIMIT 1
    `;
    if (bookingRows.length === 0) {
      return NextResponse.json({ error: 'You must have a completed booking with this trainer to leave a review' }, { status: 403 });
    }

    // Check for existing review on this booking
    const existingReview = await sql`
      SELECT id FROM reviews WHERE client_id = ${clientId} AND trainer_id = ${trainerId}
      ${booking_id ? sql`AND booking_id = ${booking_id}` : sql``}
      LIMIT 1
    `;
    if (existingReview.length > 0) {
      return NextResponse.json({ error: 'You have already reviewed this trainer' }, { status: 409 });
    }

    const review = await sql`
      INSERT INTO reviews (booking_id, client_id, trainer_id, rating, comment)
      VALUES (${booking_id || bookingRows[0].id}, ${clientId}, ${trainerId}, ${rating}, ${comment || null})
      RETURNING *
    `;

    // Update trainer avg_rating and review_count
    await sql`
      UPDATE trainers SET
        avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE trainer_id = ${trainerId}),
        review_count = (SELECT COUNT(*) FROM reviews WHERE trainer_id = ${trainerId}),
        updated_at = NOW()
      WHERE id = ${trainerId}
    `;

    return NextResponse.json(review[0], { status: 201 });
  } catch (error) {
    console.error('[Reviews POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
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
    const body = await request.json();
    const { review_id, trainer_reply } = body;

    if (!review_id || !trainer_reply) {
      return NextResponse.json({ error: 'review_id and trainer_reply required' }, { status: 400 });
    }

    // Verify trainer ownership
    const trainer = await sql`SELECT id, user_id FROM trainers WHERE id = ${trainerId}`;
    if (trainer.length === 0 || trainer[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await sql`
      UPDATE reviews SET trainer_reply = ${trainer_reply}
      WHERE id = ${review_id} AND trainer_id = ${trainerId}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[Reviews PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
