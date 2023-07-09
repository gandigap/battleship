import Room from '../room';
import { UserWebSocket } from '../types';
import { Position, Ship } from '../types/ship';

class RoomsDB {
  private rooms: Room [];

  constructor() {
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
      .find(({ roomUsers }) => roomUsers.find((roomUser) => roomUser.index === id));
    return room || null;
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
    const room = this.rooms.find(({ roomId }) => roomId === id);
    return room || null;
  }

  getRoomByGameId(id: number) {
    const room = this.rooms.find(({ game }) => game.idGame === id);
    return room || null;
  }

  addShipsToGame(gameId: number, playerIndex: number, ships: Ship[]) {
    const room = this.getRoomByGameId(gameId);
    if (!room) {
      console.log('Skipped skips adding: no room/game found');
      return;
    }

    room.setPlayerShips(playerIndex, ships);
  }

  handleAttack(gameId: number, playerId: number, target: Position | null) {
    const room = this.getRoomByGameId(gameId);

    if (!room) {
      console.log('Room or game didn`t found!');
      return;
    }

    const isEndOfGame = room.handleAttack(playerId, target);

    if (isEndOfGame) {
      this.closeRoom(room.roomId);
    }

    // eslint-disable-next-line consistent-return
    return isEndOfGame;
  }

  closeRoom(id: number) {
    this.rooms = this.rooms.filter(({ roomId }) => roomId !== id);
  }
}

export default RoomsDB;
