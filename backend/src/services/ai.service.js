import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ENV } from "../config/env.js";

const model = new ChatGoogleGenerativeAI({
  apiKey: ENV.GEMINI_API_KEY,
  model: "gemini-3.6-flash",
});

export async function getChatResponse(message) {
  const response = await model.invoke(message);
  return response.content;
}