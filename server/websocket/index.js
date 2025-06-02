import { WebSocketServer } from "ws";
import ChatService from "../api/chat/handler/chatHandler.js";

export default function createWebSocketServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("client connected");

    ws.on("message", async (message) => {
      await new ChatService().chatHandler(ws, message);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}
