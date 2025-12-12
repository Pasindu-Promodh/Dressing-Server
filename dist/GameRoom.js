"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const colyseus_1 = require("colyseus");
const GameState_1 = require("./GameState");
const RoomRegistry_1 = require("./RoomRegistry");
class GameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 2;
        this.roomIds = [];
    }
    onCreate(options) {
        this.setState(new GameState_1.GameState());
        // Generate 4-digit room ID if not provided
        if (!options.roomId) {
            options.roomId = this.generateRoomId();
        }
        this.roomId = options.roomId;
        this.setMetadata({ roomId: this.roomId });
        console.log(`Room ${this.roomId} created`);
        RoomRegistry_1.RoomRegistry.addRoom(this.roomId, this);
        // Handle player movement messages
        this.onMessage("move", (client, message) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.x = message.x;
                player.y = message.y;
                player.z = message.z;
                player.rotY = message.rotY;
            }
        });
        // Update loop (optional, for game logic)
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));
        this.roomIds.push(this.roomId);
    }
    onJoin(client, options) {
        console.log(`Client ${client.sessionId} joined room ${this.roomId}`);
        // Create new player
        const player = new GameState_1.Player();
        player.id = client.sessionId;
        player.x = Math.random() * 10 - 5; // Random spawn
        player.y = 0.5;
        player.z = Math.random() * 10 - 5;
        player.rotY = 0;
        this.state.players.set(client.sessionId, player);
        // Notify all clients
        this.broadcast("playerJoined", {
            playerId: client.sessionId,
            playerCount: this.state.players.size,
        });
    }
    onLeave(client, consented) {
        console.log(`Client ${client.sessionId} left room ${this.roomId}`);
        this.state.players.delete(client.sessionId);
        this.broadcast("playerLeft", {
            playerId: client.sessionId,
            playerCount: this.state.players.size,
        });
    }
    onDispose() {
        console.log(`Room ${this.roomId} disposed`);
        RoomRegistry_1.RoomRegistry.removeRoom(this.roomId);
    }
    update(deltaTime) {
    }
    generateRoomId() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}
exports.GameRoom = GameRoom;
