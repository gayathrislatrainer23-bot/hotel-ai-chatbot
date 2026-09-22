import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ENV } from "../config/env.js";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: ENV.GEMINI_API_KEY,
  model: "gemini-embedding-001",
});

function truncateAndNormalize(vector, targetDim = 768) {
  const truncated = vector.slice(0, targetDim);
  const magnitude = Math.sqrt(truncated.reduce((sum, val) => sum + val * val, 0));
  return truncated.map((val) => val / magnitude);
}

export async function generateEmbedding(text) {
  const result = await embeddings.embedQuery(text);
  return truncateAndNormalize(result, 768);
}