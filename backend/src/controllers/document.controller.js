import { processAndStoreDocument } from "../services/document.service.js";
import { uploadDocumentSchema } from "../validators/document.validator.js";

export async function uploadDocumentController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { source } = uploadDocumentSchema.parse(req.body);

    const result = await processAndStoreDocument(req.file.buffer, source);

    res.status(201).json({
      success: true,
      message: `Document processed into ${result.chunksCreated} chunks`,
    });
  } catch (err) {
    next(err);
  }
}