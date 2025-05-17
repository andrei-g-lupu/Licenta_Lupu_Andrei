import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('token')?.value;
  if (!authToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = decode(authToken) as { email?: string } | null;
  if (!decoded?.email) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const userResult = await pool.query(
    'SELECT id, username, email, role FROM users WHERE email = $1',
    [decoded.email]
  );
  if (userResult.rows.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(userResult.rows[0]);
}
