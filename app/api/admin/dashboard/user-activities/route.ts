import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET() {
  try {
    // Get user activities with query counts and last activity
    const userActivitiesResult = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        COUNT(ch.id) as query_count,
        MAX(ch.created_at) as last_active,
        -- Attempt to extract location from any stored IP data (you may need to adjust this)
        'Romania' as location
      FROM users u
      LEFT JOIN chat_history ch ON u.id = ch.user_id AND ch.role = 'user'
      GROUP BY u.id, u.username, u.email
      ORDER BY query_count DESC, last_active DESC NULLS LAST
      LIMIT 50
    `);

    const userActivities = userActivitiesResult.rows.map(row => ({
      id: row.id,
      username: row.username,
      email: row.email,
      queryCount: parseInt(row.query_count),
      lastActive: row.last_active,
      location: row.location
    }));

    return NextResponse.json(userActivities);

  } catch (error) {
    console.error('User activities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user activities' },
      { status: 500 }
    );
  }
} 