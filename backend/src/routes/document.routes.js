import express from "express";
import multer from "multer";
import { uploadDocumentController } from "../controllers/document.controller.js";

const upload = multer({ storage: multer.memoryStorage() }); // keep file in memory, not disk

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDocumentController);

export default router;