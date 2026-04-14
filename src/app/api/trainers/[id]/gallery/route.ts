import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';

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

    const trainer = await sql`SELECT user_id, gallery FROM trainers WHERE id = ${trainerId}`;
    if (trainer.length === 0 || trainer[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { image_url } = await request.json();
    if (!image_url) {
      return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
    }

    const currentGallery = Array.isArray(trainer[0].gallery) ? trainer[0].gallery : [];
    const updatedGallery = [...currentGallery, image_url];

    await sql`
      UPDATE trainers SET gallery = ${JSON.stringify(updatedGallery)}, updated_at = NOW()
      WHERE id = ${trainerId}
    `;

    return NextResponse.json({ gallery: updatedGallery }, { status: 201 });
  } catch (error) {
    console.error('[Gallery POST] Error:', error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
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

    const trainer = await sql`SELECT user_id, gallery FROM trainers WHERE id = ${trainerId}`;
    if (trainer.length === 0 || trainer[0].user_id !== session.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { image_url } = await request.json();
    if (!image_url) {
      return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
    }

    const currentGallery = Array.isArray(trainer[0].gallery) ? trainer[0].gallery : [];
    const updatedGallery = currentGallery.filter((url: string) => url !== image_url);

    await sql`
      UPDATE trainers SET gallery = ${JSON.stringify(updatedGallery)}, updated_at = NOW()
      WHERE id = ${trainerId}
    `;

    return NextResponse.json({ gallery: updatedGallery });
  } catch (error) {
    console.error('[Gallery DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to remove gallery image' }, { status: 500 });
  }
}
