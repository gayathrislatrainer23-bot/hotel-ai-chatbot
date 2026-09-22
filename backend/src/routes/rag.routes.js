import express from "express";
import { askQuestionController } from "../controllers/rag.controller.js";

const router = express.Router();
router.post("/support-chat", askQuestionController);

export default router;