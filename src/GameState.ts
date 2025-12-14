import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") id: string = "";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
  @type("number") rotY: number = 0;
  @type("number") speed: number = 0;

  @type("int32") hairIndex = -1;
  @type("int32") outfitIndex = -1;
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}