import { getChatResponse } from "../services/ai.service.js";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export async function chatController(req, res, next) {
  try {
    const { message } = chatSchema.parse(req.body);
    const reply = await getChatResponse(message);
    res.status(200).json({ success: true, message: reply });
  } catch (err) {
    next(err);
  }
}