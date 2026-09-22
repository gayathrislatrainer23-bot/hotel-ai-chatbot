import { PDFParse } from "pdf-parse";
import Document from "../models/document.model.js";
import { generateEmbedding } from "./embedding.service.js";
import { splitTextIntoChunks } from "./textSplitter.service.js";

export async function processAndStoreDocument(fileBuffer, source) {
  // 1. Extract text from PDF (v2 API)
  const parser = new PDFParse({ data: fileBuffer });
  const result = await parser.getText();
  await parser.destroy();

  const fullText = result.text;

  // 2. Split into chunks
  const chunks = splitTextIntoChunks(fullText);

  // 3. Generate embedding + save each chunk
  const savedDocs = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    const doc = await Document.create({ text: chunk, source, embedding });
    savedDocs.push(doc);
  }

  return { chunksCreated: savedDocs.length, savedDocs };
}