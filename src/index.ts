import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { GameRoom } from "./GameRoom";

const app = express();
app.use(cors());
app.use(express.json());

// --- HEALTH CHECK ENDPOINT ---
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server running fine" });
});

const httpServer = createServer(app);

// --- COLYSEUS SETUP ---
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer,
    pingInterval: 5000,
    pingMaxRetries: 3
  }),
});

// Register your room
gameServer.define("game_room", GameRoom).filterBy(["roomId"]);

const PORT = Number(process.env.PORT) || 2567;

gameServer.listen(PORT).then(() => {
  console.log(`Colyseus server listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
