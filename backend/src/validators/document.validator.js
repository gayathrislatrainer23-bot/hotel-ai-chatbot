import { z } from "zod";

export const uploadDocumentSchema = z.object({
  source: z.string().min(1, "Source name is required"),
});