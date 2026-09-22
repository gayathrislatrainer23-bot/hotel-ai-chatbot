import { getRagResponse } from "../services/rag.service.js";
import { askQuestionSchema } from "../validators/rag.validator.js";

export async function askQuestionController(req, res, next) {
  try {
    
    const { question } = askQuestionSchema.parse(req.body);
    console.log(question)
    const answer = await getRagResponse(question);
    res.status(200).json({ success: true, answer });
  } catch (err) {
    next(err);
  }
}