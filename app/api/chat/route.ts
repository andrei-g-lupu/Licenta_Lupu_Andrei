import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from "ai";
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
    console.log("API route hit");
    const { messages } = await req.json();
    console.log("Messages received:", messages);

    const latestMessage = messages[messages?.length-1]?.content;
    let docContext = "";

    try {
      console.log("Getting embedding...");
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: latestMessage,
        encoding_format: "float"
      });
      console.log("Embedding created successfully");

      if (db) {
        console.log("Querying vector database...");
        const collection = await db.collection(ASTRA_DB_COLLECTION);
        const cursor = collection.find(null, {
          sort: { $vector: embedding.data[0].embedding },
          limit: 10
        });

        const documents = await cursor.toArray();
        const docsMap = documents?.map(doc => doc.text);
        docContext = JSON.stringify(docsMap);
        console.log("Vector DB context retrieved, length:", docContext.length);
      } else {
        console.warn("DB not initialized, skipping vector search");
      }
    } catch (dbError) {
      console.error("Vector DB Error:", dbError);
      // Continue without context if DB fails
    }

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

    console.log("Creating chat completion...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [template, ...messages]
    });

    console.log("OpenAI response received, creating stream...");
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error("Detailed error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Return more detailed error message
    return new Response(
      JSON.stringify({ 
        error: error.message,
        name: error.name,
        cause: error.cause
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
