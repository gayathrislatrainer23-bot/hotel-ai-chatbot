import { getAgentResponse } from "../services/agent.service.js";
import { z } from "zod";

const messageSchema = z.object({
  message: z.string().min(1),
});

export async function agentChatController(req, res, next) {
  try {
    const { message } = messageSchema.parse(req.body);
    const reply = await getAgentResponse(message);
    res.status(200).json({ success: true, reply });
  } catch (err) {
    next(err);
  }
}