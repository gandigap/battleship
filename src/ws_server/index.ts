import WebSocket, { RawData, WebSocketServer } from 'ws';
import convertMessage from '../utils/convert-message';
import { PORT } from '../config';
import COMMANDS from '../types/commands';
import getOutgoingMessage from '../utils/get-outgoing-message';
import { addPlayerToRoom, createRoom, updateRooms } from '../db/roomsDB';
import { playerAutorization, winners } from '../db/usersDB';
import { UserWebSocket } from '../types';
import {
  addShipsToGame, doAttack, createGame,
  getPlayerGameData, getTurnUserId, newGameUser, setTurnUserId, startGame,
} from '../db/gameDB';
import { OutgoingData } from '../types/outcoming';

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
          wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(winnersResponse);
            }
          });
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

        case COMMANDS.add_ships: {
          const {
            data: { gameId, indexPlayer },
          } = convertedMessage;
          const addShipsGameMessage = addShipsToGame(convertedMessage);

          if (addShipsGameMessage?.init === 2) {
            const oppositePlayerData = getPlayerGameData(gameId, indexPlayer);

            const { currentPlayerIndex } = oppositePlayerData;

            const currentPlayerData = getPlayerGameData(
              gameId,
              currentPlayerIndex,
            );

            const currentResponse = getOutgoingMessage(COMMANDS.start_game, currentPlayerData);

            ws.send(currentResponse);

            wsServer.clients.forEach((client : any) => {
              if (client.readyState === WebSocket.OPEN) {
                if (client.userId === currentPlayerIndex) {
                  const opposResponse = getOutgoingMessage(COMMANDS.start_game, oppositePlayerData);

                  client.send(opposResponse);

                  startGame(gameId);

                  setTurnUserId(gameId, indexPlayer);

                  const turnPlayerId = {
                    currentPlayer: indexPlayer,
                  };
                  const turnResponse = getOutgoingMessage(COMMANDS.turn, turnPlayerId);

                  client.send(turnResponse);
                }
              }
            });

            const turnPlayerId = {
              currentPlayer: indexPlayer,
            };

            const turnResponse = getOutgoingMessage(COMMANDS.turn, turnPlayerId);

            ws.send(JSON.stringify(turnResponse));
          }
          break;
        }

        case COMMANDS.attack: {
          const {
            data: { gameId, indexPlayer },
          } = convertedMessage;

          if (indexPlayer !== getTurnUserId(gameId)) {
            return;
          }

          const resultAttack = doAttack(convertedMessage);

          const resAttackData = resultAttack.resData;
          const attackedPlayerId = resultAttack.partnerId;

          const attackResponses = getOutgoingMessage(COMMANDS.attack, resAttackData);

          ws.send(attackResponses);

          wsServer.clients.forEach((client : any) => {
            if (client.readyState === WebSocket.OPEN) {
              if (client.userId === attackedPlayerId) {
                client.send(attackResponses);
              }
            }
          });

          if (resAttackData.status === 'miss') {
            setTurnUserId(gameId, attackedPlayerId);
            const tnResp = getOutgoingMessage(COMMANDS.turn, { currentPlayer: attackedPlayerId });

            ws.send(tnResp);

            wsServer.clients.forEach((client: any) => {
              if (client.readyState === WebSocket.OPEN) {
                if (client.userId === attackedPlayerId) {
                  client.send(tnResp);
                }
              }
            });
          } else if (resAttackData.status === 'killed') {
            const { aroundCells } = resultAttack;
            for (let index = 0; index < aroundCells.length; index += 1) {
              const item = aroundCells[index];

              const atResp = getOutgoingMessage(COMMANDS.attack, item as OutgoingData);
              ws.send(atResp);

              wsServer.clients.forEach((client: any) => {
                if (client.readyState === WebSocket.OPEN) {
                  if (client.userId === attackedPlayerId) {
                    client.send(atResp);
                  }
                }
              });
            }

            const { finish } = resultAttack;
            if (finish) {
              const finishResp = getOutgoingMessage(COMMANDS.finish, { winPlayer: indexPlayer });

              ws.send(finishResp);

              wsServer.clients.forEach((client: any) => {
                if (client.readyState === WebSocket.OPEN) {
                  if (client.userId === attackedPlayerId) {
                    client.send(finishResp);
                  }
                }
              });
            }
          }

          break;
        }

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
