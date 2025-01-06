import * as dotenv from 'dotenv';
dotenv.config(); // Load .env file
import { OpenAI } from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function testOpenAI() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [{ role: "user", content: "Test message" }],
  });

  for await (const chunk of response) {
    console.log(chunk);
  }
}

testOpenAI();