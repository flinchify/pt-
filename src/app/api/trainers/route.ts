import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await ensureTables();
    const sql = getDb();
    const params = request.nextUrl.searchParams;

    const specialisation = params.get('specialisation');
    const suburb = params.get('suburb');
    const state = params.get('state');
    const minPrice = params.get('min_price');
    const maxPrice = params.get('max_price');
    const minRating = params.get('min_rating');
    const sessionType = params.get('session_type');
    const day = params.get('day');
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build dynamic query with filters
    const conditions: string[] = ["t.status = 'active'"];
    const values: unknown[] = [];
    let paramIdx = 1;

    if (specialisation) {
      conditions.push(`${specialisation} = ANY(t.specialisations)`);
    }
    if (suburb) {
      conditions.push(`LOWER(t.home_suburb) LIKE LOWER('%' || $${paramIdx} || '%')`);
      values.push(suburb);
      paramIdx++;
    }
    if (state) {
      conditions.push(`t.state = $${paramIdx}`);
      values.push(state);
      paramIdx++;
    }
    if (minPrice) {
      conditions.push(`t.hourly_rate >= $${paramIdx}`);
      values.push(parseInt(minPrice));
      paramIdx++;
    }
    if (maxPrice) {
      conditions.push(`t.hourly_rate <= $${paramIdx}`);
      values.push(parseInt(maxPrice));
      paramIdx++;
    }
    if (minRating) {
      conditions.push(`t.avg_rating >= $${paramIdx}`);
      values.push(parseFloat(minRating));
      paramIdx++;
    }
    if (sessionType) {
      conditions.push(`${sessionType} = ANY(t.session_types)`);
    }

    // Use tagged template approach for Neon - build filters in application code
    let trainers;
    let countResult;

    // Since neon tagged templates don't support dynamic WHERE easily,
    // we fetch all active trainers and filter in code for complex cases,
    // but for performance we use direct queries for common patterns
    const allTrainers = await sql`
      SELECT t.*, u.name, u.email, u.avatar_url
      FROM trainers t
      JOIN users u ON u.id = t.user_id
      WHERE t.status = 'active'
      ORDER BY t.avg_rating DESC, t.review_count DESC
    `;

    let filtered = allTrainers;

    if (specialisation) {
      filtered = filtered.filter((t: Record<string, unknown>) =>
        Array.isArray(t.specialisations) && t.specialisations.includes(specialisation)
      );
    }
    if (suburb) {
      const suburbLower = suburb.toLowerCase();
      filtered = filtered.filter((t: Record<string, unknown>) =>
        typeof t.home_suburb === 'string' && t.home_suburb.toLowerCase().includes(suburbLower)
      );
    }
    if (state) {
      filtered = filtered.filter((t: Record<string, unknown>) => t.state === state);
    }
    if (minPrice) {
      filtered = filtered.filter((t: Record<string, unknown>) => Number(t.hourly_rate) >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((t: Record<string, unknown>) => Number(t.hourly_rate) <= parseInt(maxPrice));
    }
    if (minRating) {
      filtered = filtered.filter((t: Record<string, unknown>) => Number(t.avg_rating) >= parseFloat(minRating));
    }
    if (sessionType) {
      filtered = filtered.filter((t: Record<string, unknown>) =>
        Array.isArray(t.session_types) && t.session_types.includes(sessionType)
      );
    }

    // Check availability day filter
    if (day) {
      const dayNum = parseInt(day);
      const trainerIds = filtered.map((t: Record<string, unknown>) => t.id);
      if (trainerIds.length > 0) {
        const slots = await sql`
          SELECT DISTINCT trainer_id FROM availability_slots
          WHERE day_of_week = ${dayNum}
        `;
        const availableIds = new Set(slots.map((s: Record<string, unknown>) => s.trainer_id));
        filtered = filtered.filter((t: Record<string, unknown>) => availableIds.has(t.id));
      }
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      trainers: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[Trainers GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trainers' }, { status: 500 });
  }
}
