// // Use require for CommonJS
// const { DataAPIClient } = require("@datastax/astra-db-ts");
// const OpenAI = require("openai");
// const { PuppeteerWebBaseLoader } = require("langchain/document_loaders/web/puppeteer");
// const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

// require("dotenv/config");


// // Type declaration for TypeScript, but will be ignored in runtime for CommonJS
// // type SimilarityMetric = "dot_product" | "cosine" | "euclidean"; // This would be just for TypeScript and not for runtime in JS

// // Load environment variables
// const {
//   ASTRA_DB_NAMESPACE,
//   ASTRA_DB_COLLECTION,
//   ASTRA_DB_API_ENDPOINT,
//   ASTRA_DB_APPLICATION_TOKEN,
//   OPENAI_API_KEY,
// } = process.env;

// // Validate environment variables
// if (
//   !ASTRA_DB_NAMESPACE ||
//   !ASTRA_DB_COLLECTION ||
//   !ASTRA_DB_API_ENDPOINT ||
//   !ASTRA_DB_APPLICATION_TOKEN ||
//   !OPENAI_API_KEY
// ) {
//   console.error("Missing one or more required environment variables:");
//   console.error({
//     ASTRA_DB_NAMESPACE,
//     ASTRA_DB_COLLECTION,
//     ASTRA_DB_API_ENDPOINT,
//     ASTRA_DB_APPLICATION_TOKEN,
//     OPENAI_API_KEY,
//   });
//   process.exit(1);
// }

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// const data = [
//   "https://lege5.ro/Gratuit/g43donzvgi/codul-fiscal-din-2015",
// ];

// const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
// const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 5000,
//   chunkOverlap: 500,
// });

// // Global error handlers for unhandled exceptions
// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
// });

// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception thrown:", err);
// });

// const createCollection = async (similarityMetric = "dot_product") => {
//   try {
//     console.log(`Creating collection: ${ASTRA_DB_COLLECTION}`);
//     const res = await db.createCollection(ASTRA_DB_COLLECTION, {
//       vector: {
//         dimension: 1536,
//         metric: similarityMetric,
//       },
//     });
//     console.log("Collection created successfully:", res);
//   } catch (error) {
//     console.error("Error creating collection:", error);
//     throw error;
//   }
// };

// const loadSampleData = async () => {
//   try {
//     const collection = await db.collection(ASTRA_DB_COLLECTION);
//     console.log("Collection reference retrieved successfully.");
//     for (const url of data) {
//       console.log(`Processing URL: ${url}`);
//       const content = await scrapePage(url);
//       if (!content) {
//         console.warn(`Skipping URL due to empty content: ${url}`);
//         continue;
//       }

//       console.log(`Splitting content into chunks for URL: ${url}`);
//       const chunks = await splitter.splitText(content);
//       console.log(`Split content into ${chunks.length} chunks for URL: ${url}`);

//       for (const chunk of chunks) {
//         try {
//           console.log("Generating embedding for a chunk...");
//           const embedding = await openai.embeddings.create({
//             model: "text-embedding-ada-002",
//             input: chunk,
//           });
//           console.log("Embedding generated successfully.");
//           const vector = embedding.data[0].embedding;

//           console.log("Inserting data into collection...");
//           const res = await collection.insertOne({
//             $vector: vector,
//             text: chunk,
//           });
//           console.log("Data inserted successfully:", res);
//         } catch (err) {
//           console.error("Error inserting chunk into the database:", err);
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error loading sample data:", error);
//   }
// };

// const scrapePage = async (url) => {
//   try {
//     console.log(`Starting scraping for: ${url}`);
//     const loader = new PuppeteerWebBaseLoader(url, {
//       launchOptions: {
//         headless: true,
//       },
//       gotoOptions: {
//         waitUntil: "domcontentloaded",
//       },
//       evaluate: async (page, browser) => {
//         try {
//           const result = await page.evaluate(() => document.body.innerHTML);
//           await browser.close();
//           return result;
//         } catch (err) {
//           console.error("Error during Puppeteer evaluation:", err);
//           await browser.close();
//           throw err;
//         }
//       },
//     });

//     const scrapedContent = await loader.scrape();
//     if (!scrapedContent) {
//       console.warn(`No content found for URL: ${url}`);
//       return null;
//     }
//     console.log(`Scraping complete for: ${url}`);
//     return scrapedContent.replace(/<[^>]*>?/gm, "");
//   } catch (error) {
//     console.error(`Error scraping URL (${url}):`, error);
//     return null;
//   }
// };

// // Main execution
// (async () => {
//   try {
//     console.log("Creating collection...");
//     await createCollection();
//     console.log("Loading sample data...");
//     await loadSampleData();
//   } catch (err) {
//     console.error("Unexpected error during execution:", err);
//   }
// })();
