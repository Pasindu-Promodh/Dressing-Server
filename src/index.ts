import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { GameRoom } from "./GameRoom";

const app = express();
app.use(cors());
app.use(express.json());

const gameServer = new Server({
  server: createServer(app),
});

// Register the GameRoom
gameServer.define("game_room", GameRoom).filterBy(["roomId"]);

const PORT = Number(process.env.PORT) || 2567;

gameServer.listen(PORT).then(() => {
  console.log(`✅ Colyseus server listening on port ${PORT}`);
  console.log(`🎮 Available at: http://localhost:${PORT}`);
});
