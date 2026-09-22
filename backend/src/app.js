import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
 import ragRoutes from "./routes/rag.routes.js";
 import documentRoutes from "./routes/document.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
// import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/documents", documentRoutes);
app.use("/chat", chatRoutes);
app.use("/rag", ragRoutes);

// app.use("/api", agentRoutes);
app.use(errorHandler); // always LAST

export default app;