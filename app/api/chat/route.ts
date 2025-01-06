import OpenAI from 'openai';
import {OpenAIStream, StreamingTextResponse} from "ai";
let DataAPIClient;
if (typeof window === "undefined") {
  DataAPIClient = require("@datastax/astra-db-ts").DataAPIClient;
}

import { streamObject, streamText } from "ai";
import { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner";
// import { openai } from '@ai-sdk/openai';

// import {OpenAIStream, StreamingTextResponse} from "ai"
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env file

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
  } = process.env;

//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
//   })

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  })
  

  const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
  const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})



  export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const latestMessage = messages[messages?.length-1]?.content

        let docContext = "";

        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage, 
            encoding_format: "float"
        });

        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION);
            const cursor = collection.find(null, {
                sort: { $vector: embedding.data[0].embedding },
                limit: 10
            });

            const documents = await cursor.toArray();
            const docsMap = documents?.map(doc => doc.text);
            docContext = JSON.stringify(docsMap);

        } catch (error) {
            console.error("Error querying DB:", error);
            docContext = "";
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
        console.log(docContext)

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", //
            stream: true,
            messages: [template, ...messages] // Include system prompt and user messages
        });

        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)


    } catch (error) {
        console.error("Error in POST function:", error);
        return new Response("Error processing request", { status: 500 }); // Return an error response
    }
}



// import { OpenAI } from "openai";
// import { DataAPIClient } from "@datastax/astra-db-ts";
// import * as dotenv from "dotenv";

// dotenv.config(); // Load .env file

// const { ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN, OPENAI_API_KEY } = process.env;

// const openai = new OpenAI(
//   new Configuration({
//     apiKey: OPENAI_API_KEY,
//   })
// );

// const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
// const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

// export async function POST(req) {
//   try {
//     const { messages } = await req.json();

//     if (!messages || messages.length === 0) {
//       return new Response("No messages provided.", { status: 400 });
//     }

//     const embedding = await openai.createEmbedding({
//       model: "text-embedding-ada-002",
//       input: messages[messages.length - 1].content,
//     });

//     let docContext = "";

//     try {
//       const collection = await db.collection(ASTRA_DB_COLLECTION);
//       const cursor = collection.find(
//         { $vector: { $near: { vector: embedding.data[0].embedding, distance: 10 } } },
//         { limit: 10 }
//       );
//       const documents = await cursor.toArray();
//       docContext = JSON.stringify(documents.map((doc) => doc.text));
//     } catch (dbError) {
//       console.error("DB Error:", dbError);
//     }

//     const systemPrompt = {
//       role: "system",
//       content: `You are an AI assistant for Formula One knowledge.`,
//     };

//     const response = await openai. chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [systemPrompt, ...messages],
//       stream: true,
//     });

//     const encoder = new TextEncoder();
//     const stream = new ReadableStream({
//       start(controller) {
//         response.data.on("data", (chunk) => {
//           controller.enqueue(encoder.encode(chunk));
//         });

//         response.data.on("end", () => {
//           controller.close();
//         });

//         response.data.on("error", (err) => {
//           console.error("Stream error:", err);
//           controller.error(err);
//         });
//       },
//     });

//     return new Response(stream, {
//       headers: { "Content-Type": "text/event-stream" },
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return new Response("Error processing request", { status: 500 });
//   }
// }
