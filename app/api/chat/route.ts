import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { DataAPIClient } from "@datastax/astra-db-ts";
import * as dotenv from 'dotenv';
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from 'openai/resources/chat/completions';

dotenv.config();

// Debug environment variables
console.log("Environment check:", {
  namespace: !!process.env.ASTRA_DB_NAMESPACE,
  collection: !!process.env.ASTRA_DB_COLLECTION,
  endpoint: !!process.env.ASTRA_DB_API_ENDPOINT,
  token: !!process.env.ASTRA_DB_APPLICATION_TOKEN,
  openai: !!process.env.OPENAI_API_KEY
});

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

// Add this debug logging
console.log('Database URL check:', {
  exists: !!process.env.DATABASE_URL,
  // Log first 20 chars of URL if it exists (for security)
  preview: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 20)}...` : 'not set'
});

// Modify the pool configuration with more generous timeouts and retry logic
const pool = new Pool({
  connectionString: "postgresql://postgres.bqhtfgqaiidzsatkchao:Godofnaruto1!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  ssl: { rejectUnauthorized: false },
  max: 10, // Reduce max connections
  idleTimeoutMillis: 60000, // Increase idle timeout to 1 minute
  connectionTimeoutMillis: 10000 // Increase connection timeout to 10 seconds
});

// Add connection error handling
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
  // Attempt to reconnect
  setTimeout(() => {
    console.log('Attempting to reconnect to PostgreSQL...');
    pool.connect();
  }, 5000);
});

// Add a connection test function
const testDatabaseConnection = async () => {
  let retries = 3;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log('Database connection successful');
      client.release();
      return true;
    } catch (error) {
      console.error(`Connection attempt failed (${retries} retries left):`, error);
      retries--;
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }
  }
  return false;
};

console.log("API Key present:", !!process.env.OPENAI_API_KEY);
console.log("Astra DB Token present:", !!process.env.ASTRA_DB_APPLICATION_TOKEN);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize AstraDB client
let client: DataAPIClient | null = null;
let db: any = null;

const initializeAstraDB = async () => {
  try {
    console.log("Initializing AstraDB with:", {
      endpoint: process.env.ASTRA_DB_API_ENDPOINT?.substring(0, 20) + "...",
      namespace: process.env.ASTRA_DB_NAMESPACE,
      collection: process.env.ASTRA_DB_COLLECTION
    });

    client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN as string);
    db = client.db(process.env.ASTRA_DB_API_ENDPOINT as string, { 
      namespace: process.env.ASTRA_DB_NAMESPACE 
    });
    
    // Verificăm explicit dacă putem accesa colecția
    const collection = await db.collection(process.env.ASTRA_DB_COLLECTION as string);
    const testQuery = await collection.find({}, { limit: 1 }).toArray();
    console.log("Test query result:", testQuery.length > 0 ? "Success" : "No documents found");
    
    return true;
  } catch (error) {
    console.error("AstraDB initialization error:", error);
    return false;
  }
};

// Simple in-memory rate limiting
const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20; // 20 requests per minute
const requestCounts = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);

  if (!userRequests) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - userRequests.timestamp > RATE_LIMIT_DURATION) {
    // Reset if time window has passed
    requestCounts.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (userRequests.count >= MAX_REQUESTS) {
    return true;
  }

  userRequests.count++;
  return false;
}

// Add immediate connection test
(async () => {
  try {
    const client = await pool.connect();
    console.log('Initial database connection test successful');
    client.release();
  } catch (error) {
    console.error('Initial database connection test failed:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
  }
})();

export async function POST(req: Request) {
  try {
    console.log('Attempting database connection...');
    const isConnected = await testDatabaseConnection();
    
    if (!isConnected) {
      console.error('Failed to establish database connection after retries');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }

    console.log("1. Starting request processing");
    const { messages, conversationId } = await req.json();

    // Verificăm dacă conversationId este valid
    if (!conversationId || conversationId.length < 10) {
      console.error("Invalid conversation ID:", conversationId);
      return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
    }

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

    // Get user data
    const userResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [decodedToken.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userResult.rows[0];
    const timestamp = new Date();

    // Save user message
    await pool.query(
      'INSERT INTO chat_history (user_id, message_content, role, conversation_id, created_at) VALUES ($1, $2, $3, $4, $5)',
      [userData.id, messages[messages.length - 1].content, 'user', conversationId, timestamp]
    );

    // După autentificare și înainte de a încerca să obținem contextul conversațional
    let conversationContext = '';

    // Verificăm mai întâi dacă există conversația
    const conversationCheck = await pool.query(
      'SELECT COUNT(*) as count FROM chat_history WHERE conversation_id = $1',
      [conversationId]
    );

    console.log("Checking if conversation exists:", {
      conversationId,
      exists: conversationCheck.rows[0].count > 0
    });

    // Doar dacă există conversația, obținem contextul
    if (conversationCheck.rows[0].count > 0) {
      console.log("Conversation exists, fetching context...");
      const historyResult = await pool.query(
        `SELECT message_content, role, created_at 
         FROM chat_history 
         WHERE conversation_id = $1 
         AND created_at >= NOW() - INTERVAL '1 hour'
         ORDER BY created_at ASC`,
        [conversationId]
      );
      
      conversationContext = historyResult.rows
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.message_content}`)
        .join('\n');

      console.log("Context loaded with", historyResult.rows.length, "messages");
    } else {
      console.log("New conversation started, no context to load");
      conversationContext = 'Aceasta este o conversație nouă.';
    }

    // Folosim conversationContext în prompturi doar dacă există
    const queryEnhancementPrompt: ChatCompletionSystemMessageParam = {
      role: "system",
      content: `Ești un expert în Codul Fiscal al României. 
      Sarcina ta este să transformi întrebarea utilizatorului într-o căutare mai detaliată și explicită.
      
      ${conversationContext ? `Conversație anterioară:\n${conversationContext}\n` : ''}
      
      Întrebarea utilizatorului: ${messages[messages.length - 1].content}
      
      Reformulează întrebarea pentru o căutare mai precisă:`
    };

    const enhancementResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [queryEnhancementPrompt],
      temperature: 0.3,
      max_tokens: 200
    });

    const enhancedQuery = enhancementResponse.choices[0].message.content;
    console.log("2. Enhanced query created:", enhancedQuery);

    // Verificăm inițializarea AstraDB
    console.log("3. Checking AstraDB initialization...");
    const isAstraInitialized = await initializeAstraDB();
    console.log("4. AstraDB initialized:", isAstraInitialized);

    // 2. Create embedding and search in AstraDB
    let relevantContext = "";
    try {
      console.log("Creating embedding for query:", enhancedQuery);
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: enhancedQuery,
        encoding_format: "float"
      });

      console.log("Embedding created, attempting DB search");
      
      await initializeAstraDB(); // Reinițializăm explicit

      if (db) {
        const collection = await db.collection(process.env.ASTRA_DB_COLLECTION as string);
        
        // Modificăm query-ul pentru a fi mai permisiv
        const cursor = collection.find(
          {},  // No initial filter
          {
            sort: { $vector: embedding.data[0].embedding },
            limit: 10, // Mărim limita
            fields: ['text', 'metadata']
          }
        );

        const documents = await cursor.toArray();
        console.log("Found documents:", documents.length);
        
        if (documents && documents.length > 0) {
          // Afișăm primele câteva caractere din fiecare document pentru debugging
          documents.forEach((doc, idx) => {
            console.log(`Doc ${idx}: ${doc.text.substring(0, 100)}...`);
          });
          
          relevantContext = documents
            .map(doc => doc.text)
            .join("\n\n");
        } else {
          console.log("No documents found in AstraDB");
        }
      }
    } catch (dbError) {
      console.error("Detailed Vector DB Error:", dbError);
    }

    // 3. Final interaction with ChatGPT
    const finalPrompt: ChatCompletionSystemMessageParam = {
      role: "system",
      content: `Ești un expert în Codul Fiscal al României. 
      
      Context relevant din legislație:
      ${relevantContext}

      Conversație anterioară:
      ${conversationContext}

      Întrebarea originală: ${messages[messages.length - 1].content}
      Întrebarea detaliată: ${enhancedQuery}

      Răspunde folosind informațiile din context și menționează articolele specifice din Codul Fiscal. 
      Foarte important: Daca nu este despre codul fiscal, spune ca tu esti antrenat doar pe Codul fiscal si happy sa raspunzi la intrebari despre acesta.`
    };

    const finalMessages: ChatCompletionMessageParam[] = [
      finalPrompt,
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: finalMessages
    });

    let fullResponse = '';
    const stream = OpenAIStream(response, {
      onToken: (token) => {
        fullResponse += token;
      },
      onCompletion: async (completion) => {
        try {
          const aiTimestamp = new Date(timestamp.getTime() + 1);
          await pool.query(
            'INSERT INTO chat_history (user_id, message_content, role, conversation_id, created_at) VALUES ($1, $2, $3, $4, $5)',
            [userData.id, fullResponse, 'assistant', conversationId, aiTimestamp]
          );
        } catch (error) {
          console.error("Error saving AI response:", error);
        }
      }
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Funcție helper pentru calculul scorului de relevanță
function calculateRelevanceScore(doc: any, query: string): number {
  let score = 1.0;
  
  // Adaugă logică de scoring bazată pe:
  // - Prezența cuvintelor cheie
  // - Metadata (dacă există)
  // - Lungimea documentului
  // - Alte criterii relevante

  return score;
}
