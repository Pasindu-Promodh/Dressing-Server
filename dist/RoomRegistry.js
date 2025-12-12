"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRegistry = void 0;
class RoomRegistry {
    static addRoom(roomId, room) {
        this.rooms.set(roomId, room);
    }
    static removeRoom(roomId) {
        this.rooms.delete(roomId);
    }
    static getAllRooms() {
        return Array.from(this.rooms.keys());
    }
}
exports.RoomRegistry = RoomRegistry;
RoomRegistry.rooms = new Map();
