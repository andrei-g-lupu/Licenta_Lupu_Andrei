import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';

export async function GET() {
  try {
    // Get query trends for the last 30 days
    const queryTrendsResult = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as queries,
        COUNT(DISTINCT user_id) as users
      FROM chat_history 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    console.log('Raw query trends data:', queryTrendsResult.rows);

    const queryTrends = queryTrendsResult.rows.map(row => ({
      date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
      queries: parseInt(row.queries) || 0,
      users: parseInt(row.users) || 0
    }));

    console.log('Processed query trends:', queryTrends);

    // If we don't have data for some days, fill in with zeros
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const filledTrends = [];
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const existingData = queryTrends.find(trend => {
        const trendDate = trend.date instanceof Date ? trend.date.toISOString().split('T')[0] : trend.date;
        return trendDate === dateStr;
      });
      
      filledTrends.push({
        date: dateStr,
        queries: existingData?.queries || 0,
        users: existingData?.users || 0
      });
    }

    console.log('Filled trends (last 5):', filledTrends.slice(-5));

    return NextResponse.json(filledTrends);

  } catch (error) {
    console.error('Query trends error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch query trends', details: error.message },
      { status: 500 }
    );
  }
} 