import { playerAutorization, winners } from '../db/usersDB';
import { IncomingData } from '../types/incoming';
import COMMANDS from '../types/commands';
import getOutgoingMessage from '../utils/get-outgoing-message';
import { createRoom, updateRooms } from '../db/roomsDB';
import { UserWebSocket } from '../types';

// import { AttackData, IncomingData } from '../types/incoming';
// import { Position } from '../types/ship';

class Controller {
  implementMessage(convertedMessage: IncomingData, ws: UserWebSocket) {
    console.log(this);
    const { type } = convertedMessage;
    console.log('implementMessage', convertedMessage);
    switch (type) {
      case COMMANDS.reg: {
        const userAutorizationMessage = playerAutorization(convertedMessage);
        const addUserMessage = getOutgoingMessage(COMMANDS.reg, userAutorizationMessage);
        ws.userId = userAutorizationMessage.index;
        ws.send(addUserMessage);

        const updateRoomsMessage = updateRooms();
        const roomsResponse = getOutgoingMessage(COMMANDS.update_room, updateRoomsMessage);

        ws.send(roomsResponse);

        //       const winners = this.userDB.getWinners();
        const winnersResponse = getOutgoingMessage(COMMANDS.update_winners, winners);
        console.log('winnersResponse', winnersResponse);
        //       this.clientsNotify(winnersResponse);
        break;
      }

      case COMMANDS.create_room: {
        const { userId } = ws as UserWebSocket;
        const newRoom = createRoom(userId);
        const updateRoomsMessage = getOutgoingMessage(COMMANDS.update_room, newRoom);
        console.log('new room3', updateRoomsMessage);
        break;
      }

      //     case COMMANDS.add_user_to_room: {
      //       const {
      //         data: { indexRoom },
      //       } = convertedMessage;

      //       this.roomsDB.addPlayerToRoom(ws as UserWebSocket, indexRoom);

      //       const rooms = this.roomsDB.getRooms();
      //       const roomsResponse = getOutgoingMessage(COMMANDS.update_room, rooms);
      //       this.clientsNotify(roomsResponse);
      //       break;
      //     }

      //     case COMMANDS.add_ships: {
      //       const {
      //         data: { gameId, indexPlayer, ships },
      //       } = convertedMessage;

      //       this.roomsDB.addShipsToGame(gameId, indexPlayer, ships);
      //       break;
      //     }

      //     case COMMANDS.attack: {
      //       const { data } = convertedMessage;
      //       const { gameId, indexPlayer } = data;

      //       const { x, y } = data as AttackData;

      //       const target: Position | null = x !== undefined && y !== undefined ? { x, y } : null;

      //       const isEndOfGame = this.roomsDB.handleAttack(gameId, indexPlayer, target);

      //       if (isEndOfGame) {
      //         this.userDB.markTheWinner(indexPlayer);
      //         const winners = this.userDB.getWinners();
      //         const winnersResponse = getOutgoingMessage(COMMANDS.update_winners, winners);

      //         this.clientsNotify(winnersResponse);
      //       }
      //       break;
      //     }

      default:
        console.log('default');
        break;
    }
  }
}

export default Controller;
