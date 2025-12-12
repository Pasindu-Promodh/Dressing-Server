"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const GameRoom_1 = require("./GameRoom");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const gameServer = new colyseus_1.Server({
    server: (0, http_1.createServer)(app),
});
// Register the GameRoom
gameServer.define("game_room", GameRoom_1.GameRoom).filterBy(["roomId"]);
const PORT = Number(process.env.PORT) || 2567;
gameServer.listen(PORT).then(() => {
    console.log(`✅ Colyseus server listening on port ${PORT}`);
    console.log(`🎮 Available at: http://localhost:${PORT}`);
});
