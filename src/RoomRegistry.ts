export class RoomRegistry {
    static rooms: Map<string, any> = new Map();

    static addRoom(roomId: string, room: any) {
        this.rooms.set(roomId, room);
    }

    static removeRoom(roomId: string) {
        this.rooms.delete(roomId);
    }

    static getAllRooms() {
        return Array.from(this.rooms.keys());
    }
}
