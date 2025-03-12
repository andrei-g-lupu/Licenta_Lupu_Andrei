import { Pool } from 'pg';
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: "postgresql://postgres.bqhtfgqaiidzsatkchao:Godofnaruto1!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  ssl: { rejectUnauthorized: false }
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user from auth token
    const cookieStore = await cookies();
    const authToken = cookieStore.get('token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = decode(authToken) as { email?: string } | null;

    if (!decodedToken?.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [decodedToken.email]
    );

    if (userResult.rows.length === 0) {
      return new Response('User not found', { status: 404 });
    }

    const userId = userResult.rows[0].id;

    if (conversationId) {
      const messagesResult = await pool.query(
        `SELECT ch.*, 
         CASE 
           WHEN ch.role = 'user' THEN created_at 
           ELSE created_at + interval '1 millisecond' 
         END as sort_time
         FROM chat_history ch
         WHERE user_id = $1 AND conversation_id = $2 
         ORDER BY sort_time ASC`,
        [userId, conversationId]
      );

      const result = [{
        conversation_id: conversationId,
        messages: messagesResult.rows
      }];

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const historyResult = await pool.query(
        `SELECT ch.conversation_id, 
         (SELECT json_agg(m.* ORDER BY m.created_at DESC) 
          FROM (
            SELECT * FROM chat_history 
            WHERE conversation_id = ch.conversation_id 
            ORDER BY created_at DESC 
            LIMIT $2
          ) m
         ) as messages
         FROM chat_history ch
         WHERE ch.user_id = $1
         GROUP BY ch.conversation_id
         ORDER BY MAX(ch.created_at) DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return new Response(JSON.stringify(historyResult.rows), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Error fetching chat history' }, { status: 500 });
  }
} 