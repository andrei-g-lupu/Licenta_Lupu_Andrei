import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
let DataAPIClient;
if (typeof window === "undefined") {
  DataAPIClient = require("@datastax/astra-db-ts").DataAPIClient;
}
import * as dotenv from 'dotenv';

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

// Wrap DB initialization in try-catch
let client;
let db;
try {
  client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
  db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });
  console.log("DB client initialized successfully");
} catch (error) {
  console.error("DB initialization error:", error);
}

export async function POST(req: Request) {
  try {
    console.log("1. POST request received");
    const { messages, conversationId } = await req.json();
    
    if (!conversationId) {
      return new Response('Conversation ID is required', { status: 400 });
    }
    console.log("2. Using conversation ID:", conversationId);
    
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

    // Save user message with the conversation ID
    const latestMessage = messages[messages.length - 1];
    console.log("8. Saving user message to chat_history with conversation_id:", conversationId);
    await pool.query(
      'INSERT INTO chat_history (user_id, message_content, role, conversation_id) VALUES ($1, $2, $3, $4)',
      [userData.id, latestMessage.content, latestMessage.role, conversationId]
    );
    console.log("9. User message saved");

    let docContext = "";

    try {
      console.log("10. Getting embedding for message:", latestMessage.content);
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: latestMessage.content,
        encoding_format: "float"
      });
      console.log("11. Embedding created successfully");

      if (db) {
        console.log("12. Querying vector database...");
        const collection = await db.collection(ASTRA_DB_COLLECTION);
        const cursor = collection.find(null, {
          sort: { $vector: embedding.data[0].embedding },
          limit: 5
        });

        const documents = await cursor.toArray();
        if (documents && documents.length > 0) {
          const docsMap = documents.map(doc => doc.text);
          docContext = docsMap.join("\n\n");
          console.log("13. Vector DB context retrieved, length:", docContext.length);
        } else {
          console.log("13. No matching documents found in vector DB");
          docContext = "Nu am găsit informații relevante pentru această întrebare în baza de date.";
        }
      } else {
        console.warn("DB not initialized, skipping vector search");
        docContext = "Baza de date nu este disponibilă momentan.";
      }
    } catch (dbError) {
      console.error("Vector DB Error:", dbError);
      docContext = "A apărut o eroare în căutarea informațiilor.";
    }

    console.log("14. Creating chat completion with context length:", docContext.length);
    const template = {
      role: "system",
      content: `Ești un asistent AI care știe totul despre legislatia din Romania.
Folosind contextul de mai jos, poți să-ți completezi cunoștințele despre legea din Romania.
Contextul îți va furniza toate legile din Codul Muncii, Codul Fiscal si Codul Penal.
Raspunde in propozitii ample. Intelege faptul ca in raspunsul tau nu poti sa te referi la alineate din context, deoarece utilizatorul nu are acces la context, daca acel context este relevant, include-l de asemenea in raspunsul tau.

De fiecare dată când răspunzi:

Include și sursa informației tale.
Dacă există un link către acea pagină, include-l de asemenea.
Dacă contextul nu conține informațiile necesare, nu răspunde pe baza cunoștințelor tale existente și menționează că nu știi.

Formatul răspunsurilor trebuie să folosească markdown unde este posibil și să nu conțină imagini.

Te rog să răspunzi doar pe baza acestui citat și să te referi la link-ul acestuia drept sursa. NU AI VOIE, REPET NU AI VOIE SA RASPUNZI DINAFARA SURSEI.
        ------------
        START CONTEXT
        ${docContext}
        END CONTEXT
        ------------`
    };

    console.log("15. Creating chat completion...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [template, ...messages]
    });
    console.log("16. AI response received");

    let fullResponse = '';
    console.log("17. Setting up stream");
    const stream = OpenAIStream(response, {
      onToken: (token) => {
        fullResponse += token;
      },
      onCompletion: async (completion) => {
        console.log("18. Saving AI response to chat_history with conversation_id:", conversationId);
        try {
          await pool.query(
            'INSERT INTO chat_history (user_id, message_content, role, conversation_id) VALUES ($1, $2, $3, $4)',
            [userData.id, fullResponse, 'assistant', conversationId]
          );
          console.log("19. AI response saved");
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
