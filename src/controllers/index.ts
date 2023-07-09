import { WebSocket } from 'ws';

import UsersDB from '../db/usersDB';
import COMMANDS from '../types/commands';
import getOutgoingMessage from '../utils/get-outgoing-message';
import RoomsDB from '../db/roomsDB';
import { UserWebSocket } from '../types';
import { IncomingData } from '../types/incoming';

class Controller {
  userDB: UsersDB;

  roomsDB: RoomsDB;

  private clientsNotify: (message: string) => void;

  constructor(clientsNotify: (message: string) => void) {
    this.userDB = new UsersDB();
    this.roomsDB = new RoomsDB();
    this.clientsNotify = clientsNotify;
  }

  implementMessage(convertedMessage: IncomingData, ws : WebSocket) {
    const { type } = convertedMessage;
    console.log('implementMessage', convertedMessage);
    switch (type) {
      case COMMANDS.reg: {
        const message = this.userDB.authorization(convertedMessage);
        (ws as UserWebSocket).index = message.index;
        const addUserMessage = getOutgoingMessage(COMMANDS.reg, message);

        ws.send(addUserMessage);

        const winners = this.userDB.getWinners();
        const winnersResponse = getOutgoingMessage(COMMANDS.update_winners, winners);

        this.clientsNotify(winnersResponse);
        break;
      }

      case COMMANDS.create_room: {
        const newRoom = this.roomsDB.addRoom(ws as UserWebSocket);

        if (newRoom) {
          const rooms = this.roomsDB.getRooms();

          const updateRoomsMessage = getOutgoingMessage(COMMANDS.update_room, rooms);
          this.clientsNotify(updateRoomsMessage);
        }
        break;
      }

      case COMMANDS.add_user_to_room: {
        const {
          data: { indexRoom },
        } = convertedMessage;

        this.roomsDB.addPlayerToRoom(ws as UserWebSocket, indexRoom);

        const rooms = this.roomsDB.getRooms();
        const roomsResponse = getOutgoingMessage(COMMANDS.update_room, rooms);
        this.clientsNotify(roomsResponse);
        break;
      }

      case COMMANDS.add_ships: {
        const {
          data: { gameId, indexPlayer, ships },
        } = convertedMessage;

        this.roomsDB.addShipsToGame(gameId, indexPlayer, ships);
        break;
      }

      default:
        console.log('default');
        break;
    }
  }
}

export default Controller;
