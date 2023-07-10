import WebSocket, { RawData, WebSocketServer } from 'ws';
import convertMessage from '../utils/convert-message';
import { PORT } from '../config';
import COMMANDS from '../types/commands';
import getOutgoingMessage from '../utils/get-outgoing-message';
import { addPlayerToRoom, createRoom, updateRooms } from '../db/roomsDB';
import { playerAutorization, winners } from '../db/usersDB';
import { UserWebSocket } from '../types';
import { createGame, newGameUser } from '../db/gameDB';

const wsServer = new WebSocketServer({ port: Number(PORT) });

wsServer.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (message: RawData) => {
    try {
      const convertedMessage = convertMessage(message);

      const { type } = convertedMessage;
      const { userId } = ws as UserWebSocket;

      switch (type) {
        case COMMANDS.reg: {
          const userAutorizationMessage = playerAutorization(convertedMessage);
          const addUserMessage = getOutgoingMessage(COMMANDS.reg, userAutorizationMessage);
          (ws as UserWebSocket).userId = userAutorizationMessage.index;

          ws.send(addUserMessage);

          const updateRoomsMessage = updateRooms();
          const roomsResponse = getOutgoingMessage(COMMANDS.update_room, updateRoomsMessage);

          ws.send(roomsResponse);

          const winnersResponse = getOutgoingMessage(COMMANDS.update_winners, winners);
          console.log('winnersResponse', winnersResponse);
          //       this.clientsNotify(winnersResponse);
          break;
        }

        case COMMANDS.create_room: {
          const newRoom = createRoom(userId);
          const updateRoomsMessage = getOutgoingMessage(COMMANDS.update_room, newRoom);

          wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(updateRoomsMessage);
            }
          });
          break;
        }

        case COMMANDS.add_user_to_room: {
          const {
            data: { indexRoom },
          } = convertedMessage;
          const roomPlayers = addPlayerToRoom(indexRoom, userId);
          if (roomPlayers.length === 2) {
            const newGameId = createGame();

            wsServer.clients.forEach((client: any) => {
              if (client.readyState === WebSocket.OPEN) {
                if (client.userId === roomPlayers[0] || client.userId === roomPlayers[1]) {
                  const resNewGameData = newGameUser(newGameId, client.userId);
                  const roomsResponse = getOutgoingMessage(COMMANDS.create_game, resNewGameData);

                  client.send(roomsResponse);
                }
              }
            });

            const updateRoomsMessage = updateRooms();

            wsServer.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                const roomsResponse = getOutgoingMessage(COMMANDS.update_room, updateRoomsMessage);

                ws.send(roomsResponse);
              }
            });
          }
          break;
        }

        // case COMMANDS.add_ships: {
        //   const {
        //     data: { gameId, indexPlayer, ships },
        //   } = convertedMessage;

        //   this.roomsDB.addShipsToGame(gameId, indexPlayer, ships);
        //   break;
        // }

        //     case COMMANDS.attack: {
        //       const { data } = convertedMessage;
        //       const { gameId, indexPlayer } = data;

        //       const { x, y } = data as AttackData;

        //       const target: Position | null = x !== undefi
        // ned && y !== undefined ? { x, y } : null;

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
    } catch (error) {
      console.log('error');
    }
  });

  ws.on('open', (message: RawData) => {
    console.log('Open', message);
  });

  ws.on('close', (message) => {
    console.log('Close', message);
  });
});
