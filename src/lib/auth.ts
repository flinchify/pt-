import { cookies } from 'next/headers';
import { getDb, ensureTables } from './db';
import { v4 as uuidv4 } from 'uuid';

export interface Session {
  id: string;
  user_id: number;
  email: string;
  role: string;
  name: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  if (!sessionId) return null;

  try {
    await ensureTables();
    const sql = getDb();
    const rows = await sql`
      SELECT s.id, s.user_id, u.email, u.role, u.name
      FROM auth_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ${sessionId} AND s.expires_at > NOW()
    `;

    if (rows.length === 0) return null;
    return rows[0] as Session;
  } catch (error) {
    console.error('[getSession] DB error:', error);
    return null;
  }
}

export async function createSession(userId: number, email: string): Promise<string> {
  await ensureTables();
  const sql = getDb();
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO auth_sessions (id, user_id, token, expires_at)
    VALUES (${sessionId}, ${userId}, ${sessionId}, ${expiresAt.toISOString()})
  `;

  return sessionId;
}

export async function generateAuthCode(email: string): Promise<string> {
  await ensureTables();
  const sql = getDb();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await sql`
    INSERT INTO auth_codes (email, code, expires_at)
    VALUES (${email}, ${code}, ${expiresAt.toISOString()})
  `;

  return code;
}

export async function verifyAuthCode(email: string, code: string): Promise<boolean> {
  await ensureTables();
  const sql = getDb();

  const rows = await sql`
    SELECT id FROM auth_codes
    WHERE email = ${email} AND code = ${code} AND expires_at > NOW() AND used = false
    ORDER BY created_at DESC LIMIT 1
  `;

  if (rows.length === 0) return false;

  await sql`UPDATE auth_codes SET used = true WHERE id = ${rows[0].id}`;
  return true;
}

export async function destroySession(sessionId: string): Promise<void> {
  await ensureTables();
  const sql = getDb();
  await sql`DELETE FROM auth_sessions WHERE id = ${sessionId}`;
}
