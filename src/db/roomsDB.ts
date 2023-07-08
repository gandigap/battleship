import Room from '../room';
import { UserWebSocket } from '../types';

class RoomsDB {
  private rooms: Room [];

  constructor() {
    console.log(' New rooms DB');
    this.rooms = [];
  }

  addRoom(ws: UserWebSocket) {
    const existRoom = this.getRoomByUserId(ws.index);

    if (existRoom) {
      console.log('Player can`t create more than 1 room');
      return null;
    }

    const room = new Room(ws);
    this.rooms.push(room);

    return room;
  }

  getRoomByUserId(id: number) {
    const room = this.rooms
      .find(({ users }) => users.find((user) => user.index === id));

    return room;
  }

  getRooms() {
    return this.rooms
      .filter(({ users }) => users.length < 2);
  }
}

export default RoomsDB;
