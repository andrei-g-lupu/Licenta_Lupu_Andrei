// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { isAdmin } from '@/utils/isAdmin';
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await pool.query('SELECT id, username, email, role FROM users');
  return NextResponse.json(result.rows);
}

async function getAdminId() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('token')?.value;
  if (!authToken) return null;
  const decoded = decode(authToken) as { email?: string } | null;
  if (!decoded?.email) return null;
  const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [decoded.email]);
  return userResult.rows[0]?.id || null;
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, role } = await req.json();
  if (!id || !role) {
    return NextResponse.json({ error: 'Missing id or role' }, { status: 400 });
  }
  // Get old role for logging
  const oldUser = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
  const oldRole = oldUser.rows[0]?.role;
  await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
  // Log action
  const adminId = await getAdminId();
  await pool.query(
    'INSERT INTO user_actions_log (user_id, action_type, action_details, created_at) VALUES ($1, $2, $3, NOW())',
    [adminId, 'update_user_role', { targetUserId: id, oldRole, newRole: role }]
  );
  return NextResponse.json({ message: 'User role updated' });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  // Get username for logging
  const user = await pool.query('SELECT username FROM users WHERE id = $1', [id]);
  const username = user.rows[0]?.username;
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  // Log action
  const adminId = await getAdminId();
  await pool.query(
    'INSERT INTO user_actions_log (user_id, action_type, action_details, created_at) VALUES ($1, $2, $3, NOW())',
    [adminId, 'delete_user', { targetUserId: id, username }]
  );
  return NextResponse.json({ message: 'User deleted' });
}