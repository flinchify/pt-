import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
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
    const bookingId = parseInt(id);

    const rows = await sql`
      SELECT b.*,
        t.id as trainer_profile_id, t.photo_url as trainer_photo, t.specialisations,
        tu.name as trainer_name, tu.email as trainer_email,
        cu.name as client_name, cu.email as client_email
      FROM bookings b
      JOIN trainers t ON t.id = b.trainer_id
      JOIN users tu ON tu.id = t.user_id
      JOIN clients c ON c.id = b.client_id
      JOIN users cu ON cu.id = c.user_id
      WHERE b.id = ${bookingId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify the user is a participant
    const booking = rows[0];
    const trainerUser = await sql`SELECT user_id FROM trainers WHERE id = ${booking.trainer_id}`;
    const clientUser = await sql`SELECT user_id FROM clients WHERE id = ${booking.client_id}`;

    const isTrainer = trainerUser.length > 0 && trainerUser[0].user_id === session.user_id;
    const isClient = clientUser.length > 0 && clientUser[0].user_id === session.user_id;
    const isAdmin = session.role === 'admin';

    if (!isTrainer && !isClient && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('[Booking GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
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
    const bookingId = parseInt(id);

    const { status } = await request.json();
    if (!status || !['cancelled', 'completed', 'no_show'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be cancelled, completed, or no_show' }, { status: 400 });
    }

    const booking = await sql`SELECT * FROM bookings WHERE id = ${bookingId}`;
    if (booking.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const trainerUser = await sql`SELECT user_id FROM trainers WHERE id = ${booking[0].trainer_id}`;
    const clientUser = await sql`SELECT user_id FROM clients WHERE id = ${booking[0].client_id}`;

    const isTrainer = trainerUser.length > 0 && trainerUser[0].user_id === session.user_id;
    const isClient = clientUser.length > 0 && clientUser[0].user_id === session.user_id;

    // Only trainer can mark complete/no_show
    if ((status === 'completed' || status === 'no_show') && !isTrainer) {
      return NextResponse.json({ error: 'Only the trainer can mark sessions as completed or no_show' }, { status: 403 });
    }

    // Either party can cancel
    if (status === 'cancelled' && !isTrainer && !isClient) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await sql`
      UPDATE bookings SET status = ${status}, updated_at = NOW()
      WHERE id = ${bookingId}
      RETURNING *
    `;

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[Booking PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
