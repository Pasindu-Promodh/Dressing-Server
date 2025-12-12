import { Room, Client } from "colyseus";
import { GameState, Player } from "./GameState";
import { RoomRegistry } from "./RoomRegistry";

export class GameRoom extends Room<GameState> {
  maxClients = 2;
  roomIds: string[] = [];

  onCreate(options: any) {
    this.setState(new GameState());

    // Generate 4-digit room ID if not provided
    if (!options.roomId) {
      options.roomId = this.generateRoomId();
    }

    this.roomId = options.roomId;
    this.setMetadata({ roomId: this.roomId });

    console.log(`Room ${this.roomId} created`);

    RoomRegistry.addRoom(this.roomId, this);

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

  onJoin(client: Client, options: any) {
    console.log(`Client ${client.sessionId} joined room ${this.roomId}`);

    // Create new player
    const player = new Player();
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

  onLeave(client: Client, consented: boolean) {
    console.log(`Client ${client.sessionId} left room ${this.roomId}`);
    this.state.players.delete(client.sessionId);

    this.broadcast("playerLeft", {
      playerId: client.sessionId,
      playerCount: this.state.players.size,
    });
  }

  onDispose() {
    console.log(`Room ${this.roomId} disposed`);
    RoomRegistry.removeRoom(this.roomId);
  }

  update(deltaTime: number) {
  }

  generateRoomId(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
