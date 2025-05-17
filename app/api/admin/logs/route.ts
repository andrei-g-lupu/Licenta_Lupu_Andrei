import { NextResponse } from 'next/server';
import { isAdmin } from '@/utils/isAdmin';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET: List recent logs (optionally filter by user_id or action_type)
export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(req.url);
  const user_id = url.searchParams.get('user_id');
  const action_type = url.searchParams.get('action_type');
  let query = 'SELECT * FROM user_actions_log';
  const params: any[] = [];
  if (user_id) {
    query += ' WHERE user_id = $1';
    params.push(user_id);
    if (action_type) {
      query += ' AND action_type = $2';
      params.push(action_type);
    }
  } else if (action_type) {
    query += ' WHERE action_type = $1';
    params.push(action_type);
  }
  query += ' ORDER BY created_at DESC LIMIT 100';
  const result = await pool.query(query, params);
  return NextResponse.json(result.rows);
}