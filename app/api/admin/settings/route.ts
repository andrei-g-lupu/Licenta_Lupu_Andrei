import { NextResponse } from 'next/server';
import { isAdmin } from '@/utils/isAdmin';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET: List all settings
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await pool.query('SELECT * FROM admin_settings');
  return NextResponse.json(result.rows);
}

// PATCH: Update a setting
export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { setting_key, setting_value, updated_by } = await req.json();
  if (!setting_key || !setting_value) {
    return NextResponse.json({ error: 'Missing setting_key or setting_value' }, { status: 400 });
  }
  await pool.query(
    'UPDATE admin_settings SET setting_value = $1, updated_by = $2, updated_at = NOW() WHERE setting_key = $3',
    [setting_value, updated_by || null, setting_key]
  );
  return NextResponse.json({ message: 'Setting updated' });
}