type RoomUsers = { name : string, index: number };
class Room {
  private static roomId = 0;

  roomUsers : RoomUsers [];

  roomId: number;

  constructor(roomUsers: RoomUsers []) {
    this.roomUsers = roomUsers;
    this.roomId = Room.roomId;
    Room.roomId += 1;
  }
}

export default Room;
