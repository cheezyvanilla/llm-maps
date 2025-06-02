import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import createWebSocketServer from "./websocket";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

createWebSocketServer(app);

export default app;
