
import * as dotenv from 'dotenv';
dotenv.config();

import { OpenAI } from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing.");
    process.exit(1);
}


export default openai;