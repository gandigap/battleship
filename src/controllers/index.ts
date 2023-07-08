import { WebSocket } from 'ws';

import UsersDB from '../db/usersDB';
import COMMANDS from '../types/commands';
import getOutgoingMessage from '../utils/get-outgoing-message';
import { LoginMessage } from '../types/incoming';
import RoomsDB from '../db/roomsDB';
import { UserWebSocket } from '../types';

class Controller {
  userDB: UsersDB;

  roomsDB: RoomsDB;

  private transfer: (message: string) => void;

  constructor(transfer: (message: string) => void) {
    this.userDB = new UsersDB();
    this.roomsDB = new RoomsDB();
    this.transfer = transfer;
  }

  implementMessage(convertedMessage: LoginMessage, ws : WebSocket) {
    const { type } = convertedMessage;
    console.log('implementMessage', convertedMessage);
    switch (type) {
      case COMMANDS.reg: {
        const message = this.userDB.addUser(convertedMessage, ws);
        const addUserMessage = getOutgoingMessage(COMMANDS.reg, message);

        ws.send(addUserMessage);

        const rooms = this.roomsDB.getRooms();
        const roomsResponse = getOutgoingMessage(COMMANDS.update_room, rooms);
        ws.send(roomsResponse);

        const winners = this.userDB.getWinners();
        const winnersResponse = getOutgoingMessage(COMMANDS.update_winners, winners);

        this.transfer(winnersResponse);
        break;
      }

      case COMMANDS.create_room: {
        const addedRoom = this.roomsDB.addRoom(ws as UserWebSocket);

        if (addedRoom) {
          const rooms = this.roomsDB.getRooms();
          const updateRoomsMessage = getOutgoingMessage(COMMANDS.update_room, rooms);
          this.transfer(updateRoomsMessage);
        }
        break;
      }

      default:
        console.log('default');
        break;
    }
  }
}

export default Controller;
