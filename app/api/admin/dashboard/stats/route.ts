import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET() {
  try {
    // Get total users
    const totalUsersResult = await pool.query(
      'SELECT COUNT(*) as total FROM users'
    );
    const totalUsers = parseInt(totalUsersResult.rows[0].total);

    // Get active users today (users who made queries today)
    const activeUsersTodayResult = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as active_today 
      FROM chat_history 
      WHERE created_at >= CURRENT_DATE
    `);
    const activeUsersToday = parseInt(activeUsersTodayResult.rows[0].active_today);

    // Get total queries
    const totalQueriesResult = await pool.query(
      'SELECT COUNT(*) as total FROM chat_history WHERE role = $1',
      ['user']
    );
    const totalQueries = parseInt(totalQueriesResult.rows[0].total);

    // Get queries today
    const queriesTodayResult = await pool.query(`
      SELECT COUNT(*) as today 
      FROM chat_history 
      WHERE created_at >= CURRENT_DATE 
      AND role = $1
    `, ['user']);
    const queriesToday = parseInt(queriesTodayResult.rows[0].today);

    // Calculate average response time (simulated for now - we'll need to track this in future)
    // For now, we'll use a reasonable estimate based on AI response times
    const avgResponseTime = 1.8; // seconds

    // Determine system health based on metrics
    let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    // Check if there are any queries in the last hour
    const recentActivityResult = await pool.query(`
      SELECT COUNT(*) as recent_queries 
      FROM chat_history 
      WHERE created_at >= NOW() - INTERVAL '1 hour'
    `);
    const recentQueries = parseInt(recentActivityResult.rows[0].recent_queries);

    // Simple health check logic
    if (avgResponseTime > 5) {
      systemHealth = 'critical';
    } else if (avgResponseTime > 3 || recentQueries === 0) {
      systemHealth = 'warning';
    }

    const stats = {
      totalUsers,
      activeUsersToday,
      totalQueries,
      queriesToday,
      avgResponseTime,
      systemHealth
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 