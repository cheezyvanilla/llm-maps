import { WebSocketServer } from "ws";
import ChatService from "../api/chat/handler/chatHandler.js";

export default function createWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    verifyClient: (info, done) => {
      // Validate origin before connection
      const allowedOrigins = ["http://localhost", "http://127.0.0.1"];

      const origin = info.origin || info.req.headers.origin;

      if (
        !origin ||
        allowedOrigins.some((allowed) => origin.startsWith(allowed))
      ) {
        console.log("connection allowed, from:", origin);
        return done(true); // Allow connection
      }

      console.log(`Rejected WebSocket connection from origin: ${origin}`);
      done(false, 401, "Unauthorized"); // Reject connection
    },
  });

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
