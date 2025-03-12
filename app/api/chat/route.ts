import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { DataAPIClient } from "@datastax/astra-db-ts";
import * as dotenv from 'dotenv';
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from 'openai/resources/chat/completions';

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

// Initialize PostgreSQL Pool
const pool = new Pool({
  connectionString: "postgresql://postgres.bqhtfgqaiidzsatkchao:Godofnaruto1!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

console.log("API Key present:", !!process.env.OPENAI_API_KEY);
console.log("Astra DB Token present:", !!process.env.ASTRA_DB_APPLICATION_TOKEN);

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Initialize AstraDB client
let client: any;
let db: any;

// Move the initialization inside the POST handler
const initializeAstraDB = () => {
  if (!client) {
    try {
      client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN as string);
      db = client.db(process.env.ASTRA_DB_API_ENDPOINT as string, { 
        namespace: process.env.ASTRA_DB_NAMESPACE 
      });
      console.log("AstraDB client initialized successfully");
      return true;
    } catch (error) {
      console.error("AstraDB initialization error:", error);
      return false;
    }
  }
  return true;
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

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    console.log("1. POST request received");
    const { messages, conversationId } = await req.json();
    
    if (!conversationId) {
      return new Response('Conversation ID is required', { status: 400 });
    }
    console.log("2. Using conversation ID:", conversationId);
    
    // Initialize AstraDB when needed
    const isAstraInitialized = initializeAstraDB();
    
    // Get user from auth token
    const cookieStore = await cookies();
    const authToken = cookieStore.get('token')?.value;
    console.log("3. Auth token:", authToken ? "Found" : "Not found");
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the JWT token to get user info
    const decodedToken = decode(authToken) as { email?: string } | null;
    console.log("4. Decoded token:", decodedToken ? "Success" : "Failed");

    if (!decodedToken?.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user data from database using email
    console.log("5. Querying user data for email:", decodedToken.email);
    const userResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [decodedToken.email]
    );
    console.log("6. User query result rows:", userResult.rows.length);

    if (userResult.rows.length === 0) {
      return new Response('User not found', { status: 404 });
    }

    const userData = userResult.rows[0];
    console.log("7. Found user with email:", userData.email);

    // Save user message with the conversation ID and timestamp
    const timestamp = new Date();
    const latestMessage = messages[messages.length - 1];
    
    await pool.query(
      'INSERT INTO chat_history (user_id, message_content, role, conversation_id, created_at) VALUES ($1, $2, $3, $4, $5)',
      [userData.id, latestMessage.content, latestMessage.role, conversationId, timestamp]
    );

    // 1. Obține contextul conversației anterioare
    const historyResult = await pool.query(
      'SELECT message_content, role FROM chat_history WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversationId]
    );
    
    const conversationContext = historyResult.rows
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.message_content}`)
      .join('\n');

    // 2. Folosește OpenAI pentru a genera un query îmbunătățit pentru căutarea vectorială
    const queryEnhancementPrompt: ChatCompletionSystemMessageParam = {
      role: "system",
      content: `Ești un expert în Codul Fiscal al României. Sarcina ta este să transformi întrebarea utilizatorului într-o căutare explicită în Codul Fiscal.
      Dacă întrebarea face referire la articole sau secțiuni menționate anterior, include-le explicit.
      Dacă întrebarea este ambiguă, folosește contextul conversației pentru a o clarifica.
      
      Conversație anterioară:
      ${conversationContext}
      
      Întrebare curentă: ${messages[messages.length - 1].content}
      
      Generează o versiune extinsă și explicită a întrebării pentru căutare.`
    };

    const enhancementResponse = await openai.chat.completions.create({
      model: "ft:gpt-4o-mini-2024-07-18:personal::B2iwRLc5",
      messages: [queryEnhancementPrompt],
      temperature: 0.3,
      max_tokens: 200
    });

    const enhancedQuery = enhancementResponse.choices[0].message.content;
    console.log("Enhanced query:", enhancedQuery);

    // 3. Folosește query-ul îmbunătățit pentru embedding și căutare
    let docContext = "";
    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: enhancedQuery, // Folosim query-ul îmbunătățit aici
        encoding_format: "float"
      });

      if (db) {
        const collection = await db.collection(ASTRA_DB_COLLECTION);
        
        // 4. Îmbunătățim căutarea vectorială cu filtre și scoring mai bun
        const cursor = collection.find(null, {
          sort: { $vector: embedding.data[0].embedding },
          limit: 5,
          fields: ['text', 'metadata'] // Presupunând că ai și metadata în documente
        });

        const documents = await cursor.toArray();
        if (documents && documents.length > 0) {
          // 5. Procesăm și ordonăm rezultatele pentru relevanță
          const processedDocs = documents
            .map(doc => ({
              text: doc.text,
              score: calculateRelevanceScore(doc, enhancedQuery)
            }))
            .sort((a, b) => b.score - a.score)
            .map(doc => doc.text);

          docContext = processedDocs.join("\n\n");
        }
      }
    } catch (dbError) {
      console.error("Vector DB Error:", dbError);
    }

    // 6. Creăm un prompt mai inteligent pentru răspuns
    const systemMessage: ChatCompletionSystemMessageParam = {
      role: "system",
      content: `Ești un expert în Codul Fiscal al României.

Contextul conversației anterioare:
${conversationContext}

Întrebare originală a utilizatorului: ${messages[messages.length - 1].content}
Interpretarea extinsă a întrebării: ${enhancedQuery}

Contextul relevant din legislație:
${docContext}

Răspunde folosind informațiile din context și ține cont de:
1. Referințele anterioare din conversație
2. Interpretarea corectă a întrebării
3. Informațiile specifice din legislație

Răspunde în propoziții ample și include sursa informației.`
    };

    // Formatăm mesajele cu tipurile corecte
    const formattedMessages: ChatCompletionMessageParam[] = [
      systemMessage,
      ...messages.map(msg => {
        if (msg.role === "system") {
          return { role: "system", content: msg.content } as ChatCompletionSystemMessageParam;
        }
        return {
          role: msg.role as "user" | "assistant",
          content: msg.content
        } as ChatCompletionUserMessageParam;
      })
    ];

    const response = await openai.chat.completions.create({
      model: "ft:gpt-4o-mini-2024-07-18:personal::B2iwRLc5",
      stream: true,
      messages: formattedMessages
    });

    let fullResponse = '';
    console.log("16. Setting up stream");
    const stream = OpenAIStream(response, {
      onToken: (token) => {
        fullResponse += token;
      },
      onCompletion: async (completion) => {
        try {
          // Save AI response with a slightly later timestamp
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
