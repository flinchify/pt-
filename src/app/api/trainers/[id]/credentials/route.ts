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
    const trainerId = parseInt(id);

    // Only the trainer themselves or admins can view credentials
    const trainer = await sql`SELECT id, user_id, verified FROM trainers WHERE id = ${trainerId}`;
    if (trainer.length === 0) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }
    if (trainer[0].user_id !== session.user_id && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const credentials = await sql`
      SELECT id, document_type, document_number, issuing_authority,
             issue_date, expiry_date, ai_status, ai_notes, verified_at, created_at
      FROM credential_documents
      WHERE trainer_id = ${trainerId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      credentials,
      trainer_verified: trainer[0].verified,
    });
  } catch (error) {
    console.error('[Credentials GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 });
  }
}
