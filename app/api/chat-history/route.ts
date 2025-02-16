import { Pool } from 'pg';
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';

const pool = new Pool({
  connectionString: "postgresql://postgres.bqhtfgqaiidzsatkchao:Godofnaruto1!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  ssl: { rejectUnauthorized: false }
});

export async function GET(req: Request) {
  try {
    // Get user from auth token
    const cookieStore = cookies();
    const authToken = cookieStore.get('token')?.value;
    
    if (!authToken) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Decode the JWT token to get user info
    const decodedToken = decode(authToken) as { email?: string } | null;

    if (!decodedToken?.email) {
      return new Response('Invalid token', { status: 401 });
    }

    // Get user data from database using email
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [decodedToken.email]
    );

    if (userResult.rows.length === 0) {
      return new Response('User not found', { status: 404 });
    }

    const userId = userResult.rows[0].id;

    const { searchParams } = new URL(req.url);
    const conversationIdParam = searchParams.get('conversationId');

    if (conversationIdParam) {
      const messagesResult = await pool.query(
        'SELECT * FROM chat_history WHERE user_id = $1 AND conversation_id = $2 ORDER BY created_at ASC',
        [userId, conversationIdParam]
      );

      const result = [{ conversation_id: conversationIdParam, messages: messagesResult.rows }];
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const historyResult = await pool.query(
        `SELECT ch.conversation_id, to_json(array_agg(ch.* ORDER BY ch.created_at)) as messages
         FROM chat_history ch
         WHERE ch.user_id = $1
         GROUP BY ch.conversation_id
         ORDER BY MAX(ch.created_at) DESC`,
        [userId]
      );

      return new Response(JSON.stringify(historyResult.rows), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return new Response('Error fetching chat history', { status: 500 });
  }
} 