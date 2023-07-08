import { UserWebSocket } from '../types';
import User from '../user';

class Room {
  private static index = 0;

  roomId: number;

  users: Omit<User, 'password'> [];

  constructor(ws :UserWebSocket) {
    this.users = [];
    const { name, index } = ws;
    this.roomId = Room.index;
    this.users.push({ name, index });
    Room.index += 1;
  }
}

export default Room;
