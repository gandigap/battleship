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
    process.stdout.write('Player can`t create more than 1 room\n');
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

  if (thisPlayer && index !== undefined && index !== userId) {
    currentRoomUsers.push(index);
    currentRoomUsers.push(userId);

    currentRoom[0]?.roomUsers.push({ name: thisPlayer.name, index: userId });
  }

  return currentRoomUsers;
};
