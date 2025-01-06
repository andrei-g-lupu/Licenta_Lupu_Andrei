// Use require for CommonJS
const { DataAPIClient } = require("@datastax/astra-db-ts");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

require("dotenv/config");

// Load environment variables
const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

// Validate environment variables
if (
  !ASTRA_DB_NAMESPACE ||
  !ASTRA_DB_COLLECTION ||
  !ASTRA_DB_API_ENDPOINT ||
  !ASTRA_DB_APPLICATION_TOKEN ||
  !OPENAI_API_KEY
) {
  console.error("Missing one or more required environment variables:");
  console.error({
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
  });
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const directoryPath = "C:/Users/Andrei/Documents/Lege_Romania/dataset_impartit"; // Directory containing the .txt files

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 8000,
  chunkOverlap: 1000, // No overlap for distinct chunks
});

// Global error handlers for unhandled exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
});

const createCollection = async (similarityMetric = "cosine") => {
  try {
    console.log(`Creating collection: ${ASTRA_DB_COLLECTION}`);
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
      vector: {
        dimension: 1536,
        metric: similarityMetric,
      },
    });
    console.log("Collection created successfully:", res);
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

const loadSampleData = async () => {
  try {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    console.log("Collection reference retrieved successfully.");

    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith(".txt"));
    console.log(`Found ${files.length} text files in directory: ${directoryPath}`);

    for (const file of files) {
      console.log(`Processing file: ${file}`);
      const content = await extractTextFromFile(path.join(directoryPath, file));
      if (!content) {
        console.warn(`Skipping file due to empty content: ${file}`);
        continue;
      }

      console.log(`Splitting content into chunks for file: ${file}`);
      const chunks = await splitter.splitText(content);
      console.log(`Split content into ${chunks.length} chunks for file: ${file}`);

      for (const [index, chunk] of chunks.entries()) {
        try {
          console.log(`Generating embedding for chunk ${index + 1}/${chunks.length}...`);
          const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk,
          });
          console.log("Embedding generated successfully.");
          const vector = embedding.data[0].embedding;

          console.log("Inserting data into collection...");
          const metadata = { filename: file, chunkIndex: index + 1 };
          const res = await collection.insertOne({
            $vector: vector,
            text: chunk,
            metadata,
          });
          console.log("Data inserted successfully:", res);
        } catch (err) {
          console.error("Error inserting chunk into the database:", err);
        }
      }
    }
  } catch (error) {
    console.error("Error loading sample data:", error);
  }
};

const extractTextFromFile = async (filePath) => {
  try {
    console.log(`Reading text file: ${filePath}`);
    const content = fs.readFileSync(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Error reading text file (${filePath}):`, error);
    return null;
  }
};

// Main execution
(async () => {
  try {
    console.log("Creating collection...");
    await createCollection();
    console.log("Loading sample data...");
    await loadSampleData();
  } catch (err) {
    console.error("Unexpected error during execution:", err);
  }
})();
