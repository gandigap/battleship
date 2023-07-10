import Room from './room';
import { users } from './usersDB';

const rooms : Room [] = [];

export const updateRooms = () => {
  let roomIndex = rooms.findIndex((room) => room.roomUsers.length === 2);

  while (roomIndex >= 0) {
    rooms.splice(roomIndex, 1);

    roomIndex = rooms.findIndex((item) => item.roomUsers.length === 2);
  }

  return rooms;
};

const getRoomByUserId = (id: number) => {
  const room = rooms
    .find(({ roomUsers }) => roomUsers.find((roomUser) => roomUser.index === id));
  return room || null;
};

export const createRoom = (userId : number) => {
  const player = users.get(userId);
  const existRoom = getRoomByUserId(userId);
  if (existRoom) {
    console.log('Player can`t create more than 1 room\n');
    return rooms;
  }

  if (player) {
    const room = new Room([{ name: player.name, index: userId }]);

    rooms.push(room);
  }

  return rooms;
};

export const addPlayerToRoom = (roomId: number, userId: number) => {
  const thisPlayer = users.get(userId);

  const currentRoomUsers = [];
  const currentRoom = rooms.filter((item) => item.roomId === roomId);

  const index = currentRoom[0]?.roomUsers[0]?.index;
  console.log('addUserToRoom1', thisPlayer, index !== undefined, index !== userId);
  if (thisPlayer && index !== undefined && index !== userId) {
    currentRoomUsers.push(index);
    currentRoomUsers.push(userId);
    console.log('addUserToRoom: if', roomId, userId);
    currentRoom[0]?.roomUsers.push({ name: thisPlayer.name, index: userId });
  }

  return currentRoomUsers;
};

// import Room from '../room';
// import { UserWebSocket } from '../types';
// import { Position, Ship } from '../types/ship';

// class RoomsDB {
//   private rooms: Room [];

//   constructor() {
//     this.rooms = [];
//   }

//   addRoom(ws: UserWebSocket) {
//     const existRoom = this.getRoomByUserId(ws.index);
//     if (existRoom) {
//       console.log('Player can`t create more than 1 room');
//       return null;
//     }

//     const room = new Room(ws);
//     this.rooms.push(room);

//     return room;
//   }

//   getRooms() {
//     return this.rooms
//       .filter(({ roomUsers }) => roomUsers.length < 2)
//       .map(({ roomId, roomUsers }) => ({ roomId, roomUsers }));
//   }

//   addPlayerToRoom(ws: UserWebSocket, indexRoom: number) {
//     const room = this.getRoomByRoomID(indexRoom);
//     if (!room) {
//       console.log('Room isn`t exist!');
//       return;
//     }

//     if (this.getRoomByUserId(ws.index)) {
//       console.log('Player can`t enter his own room');
//       return;
//     }

//     room.roomUsers.push({ name: ws.name, index: ws.index });
//     room.sockets.push(ws);

//     room.createGame();
//   }

//   getRoomByRoomID(id: number) {
//     const room = this.rooms.find(({ roomId }) => roomId === id);
//     return room || null;
//   }

//   getRoomByGameId(id: number) {
//     const room = this.rooms.find(({ game }) => game.idGame === id);
//     return room || null;
//   }

//   addShipsToGame(gameId: number, playerIndex: number, ships: Ship[]) {
//     const room = this.getRoomByGameId(gameId);
//     if (!room) {
//       console.log('Skipped skips adding: no room/game found');
//       return;
//     }

//     room.setPlayerShips(playerIndex, ships);
//   }

//   handleAttack(gameId: number, playerId: number, target: Position | null) {
//     const room = this.getRoomByGameId(gameId);

//     if (!room) {
//       console.log('Room or game didn`t found!');
//       return;
//     }

//     const isEndOfGame = room.handleAttack(playerId, target);

//     if (isEndOfGame) {
//       this.closeRoom(room.roomId);
//     }

//     // eslint-disable-next-line consistent-return
//     return isEndOfGame;
//   }

//   closeRoom(id: number) {
//     this.rooms = this.rooms.filter(({ roomId }) => roomId !== id);
//   }
// }

// export default RoomsDB;
