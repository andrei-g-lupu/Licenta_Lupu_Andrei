// app/api/admin/utils/isAdmin.ts
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function isAdmin() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('token')?.value;
  if (!authToken) return false;

  const decoded = decode(authToken) as { email?: string } | null;
  if (!decoded?.email) return false;

  const userResult = await pool.query(
    'SELECT role FROM users WHERE email = $1',
    [decoded.email]
  );
  return userResult.rows[0]?.role === 'admin';
}