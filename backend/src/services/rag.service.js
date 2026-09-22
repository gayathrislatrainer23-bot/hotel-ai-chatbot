import Document from "../models/document.model.js";
import { generateEmbedding } from "./embedding.service.js";
import { getChatResponse } from "./ai.service.js";

function stripMarkdown(text) {
  return text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#/g, "").trim();
}

// Step 1: Search for relevant chunks
export async function searchDocuments(query, topK = 3) {
  const queryEmbedding = await generateEmbedding(query); // question → numbers

  const results = await Document.aggregate([
    {
      $vectorSearch: {
        index: "hotel_vector_index",   // uses your Atlas index
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: topK,
      },
    },
    {
      $project: {
        text: 1,
        source: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results; // the closest matching chunks
}

// Step 2: Use retrieved chunks to generate a grounded answer
export async function getRagResponse(question) {
  const relevantDocs = await searchDocuments(question, 3);

  if (relevantDocs.length === 0) {
    return "I don't have information about that. Please contact support for further help.";
  }

  const context = relevantDocs.map((doc) => doc.text).join("\n\n");

  const prompt = `
You are a helpful hotel support assistant. Answer the question using ONLY the context below.

STRICT FORMATTING RULES:
- Never use asterisks or markdown formatting.
- Write plain sentences only.

Other rules:
- If the question is unclear, politely ask for clarification.
- If the answer isn't in the context, say: "I don't have information about that. Please contact support for further help."
- Keep answers short and simple.

Context:
${context}

Question: ${question}
`;

  const rawAnswer = await getChatResponse(prompt);
  return stripMarkdown(rawAnswer);
}