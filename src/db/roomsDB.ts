import Room from '../room';
import { UserWebSocket } from '../types';
import { Ship } from '../types/ship';

class RoomsDB {
  private rooms: Room [];

  constructor() {
    console.log(' New rooms DB');
    this.rooms = [];
  }

  addRoom(ws: UserWebSocket) {
    const existRoom = this.getRoomByUserId(ws.index);
    console.log('existRoom', existRoom);
    if (existRoom) {
      console.log('Player can`t create more than 1 room');
      return null;
    }

    const room = new Room(ws);
    this.rooms.push(room);

    return room;
  }

  getRoomByUserId(id: number) {
    console.log('getRoomByUserId', id, this.rooms, this.rooms.length);
    const room = this.rooms
      .find(({ roomUsers: users }) => users.find((user) => user.index === id));

    return room;
  }

  getRooms() {
    return this.rooms
      .filter(({ roomUsers }) => roomUsers.length < 2)
      .map(({ roomId, roomUsers }) => ({ roomId, roomUsers }));
  }

  addPlayerToRoom(ws: UserWebSocket, indexRoom: number) {
    const room = this.getRoomByRoomID(indexRoom);
    if (!room) {
      console.log('Room isn`t exist!');
      return;
    }

    if (this.getRoomByUserId(ws.index)) {
      console.log('Player can`t enter his own room');
      return;
    }

    room.roomUsers.push({ name: ws.name, index: ws.index });
    room.sockets.push(ws);

    room.createGame();
  }

  getRoomByRoomID(id: number) {
    return this.rooms.find(({ roomId }) => roomId === id);
  }

  getRoomByGameId(id: number) {
    return this.rooms.find(({ game }) => game.idGame === id);
  }

  addShipsToGame(gameId: number, playerIndex: number, ships: Ship[]) {
    const room = this.getRoomByGameId(gameId);
    if (!room) {
      console.log('Room isn`t exist!');
      return;
    }

    room.setPlayerShips(playerIndex, ships);
  }
}

export default RoomsDB;
