import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

// In-memory storage for realtime metrics (in production, use Redis or similar)
let realtimeMetrics: Array<{
  timestamp: string;
  activeUsers: number;
  queriesPerMinute: number;
  responseTime: number;
  errorRate: number;
}> = [];

export async function GET() {
  try {
    // Get queries in the last minute
    const lastMinuteQueriesResult = await pool.query(`
      SELECT COUNT(*) as queries_last_minute
      FROM chat_history 
      WHERE created_at >= NOW() - INTERVAL '1 minute'
      AND role = 'user'
    `);
    const queriesPerMinute = parseInt(lastMinuteQueriesResult.rows[0].queries_last_minute);

    // Get active users in the last 10 minutes (users who made queries)
    const activeUsersResult = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as active_users
      FROM chat_history 
      WHERE created_at >= NOW() - INTERVAL '10 minutes'
    `);
    const activeUsers = parseInt(activeUsersResult.rows[0].active_users);

    // Simulate response time and error rate (in production, track these metrics)
    const responseTime = Math.random() * 2 + 1; // 1-3 seconds
    const errorRate = Math.random() * 0.05; // 0-5% error rate

    // Create new metric entry
    const newMetric = {
      timestamp: new Date().toISOString(),
      activeUsers,
      queriesPerMinute,
      responseTime,
      errorRate
    };

    // Add to metrics array and keep only last 60 entries (1 hour of data)
    realtimeMetrics.push(newMetric);
    if (realtimeMetrics.length > 60) {
      realtimeMetrics = realtimeMetrics.slice(-60);
    }

    return NextResponse.json(realtimeMetrics);

  } catch (error) {
    console.error('Realtime metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch realtime metrics' },
      { status: 500 }
    );
  }
} 