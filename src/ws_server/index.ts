import WebSocket, { RawData, WebSocketServer } from 'ws';
import convertMessage from '../utils/convert-message';
import { PORT } from '../config';
import COMMANDS from '../types/commands';
import getOutgoingMessage from '../utils/get-outgoing-message';
import { addPlayerToRoom, createRoom, updateRooms } from '../db/roomsDB';
import { playerAutorization, setWinner, winners } from '../db/usersDB';
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
          const regResult = getOutgoingMessage(COMMANDS.reg, userAutorizationMessage);

          process.stdout.write(`Reg result: ${regResult}\n`);
          (ws as UserWebSocket).userId = userAutorizationMessage.index;

          ws.send(regResult);

          const updateRoomsMessage = updateRooms();
          const updateRoomsResult = getOutgoingMessage(COMMANDS.update_room, updateRoomsMessage);
          process.stdout.write(`Update_room result: ${updateRoomsResult}\n`);

          ws.send(updateRoomsResult);

          const winnersResult = getOutgoingMessage(COMMANDS.update_winners, winners);
          process.stdout.write(`Update_winners result: ${winnersResult}\n`);

          wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(winnersResult);
            }
          });
          break;
        }

        case COMMANDS.create_room: {
          const newRoom = createRoom(userId);
          const updateRoomsResult = getOutgoingMessage(COMMANDS.update_room, newRoom);
          process.stdout.write(`Update_room result: ${updateRoomsResult}\n`);
          wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(updateRoomsResult);
            }
          });

          const winnersResult = getOutgoingMessage(COMMANDS.update_winners, winners);
          process.stdout.write(`Update_winners result: ${winnersResult}\n`);

          wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(winnersResult);
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
                  process.stdout.write(`Create_game result: ${roomsResponse}\n`);
                  client.send(roomsResponse);
                }
              }
            });

            const updateRoomsResult = updateRooms();

            wsServer.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                const roomsResponse = getOutgoingMessage(COMMANDS.update_room, updateRoomsResult);
                process.stdout.write(`Update_room result: ${roomsResponse}\n`);
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

            const startGameResult = getOutgoingMessage(COMMANDS.start_game, currentPlayerData);
            process.stdout.write(`Start_game result: ${startGameResult}\n`);
            ws.send(startGameResult);

            wsServer.clients.forEach((client : any) => {
              if (client.readyState === WebSocket.OPEN) {
                if (client.userId === currentPlayerIndex) {
                  const opposResponse = getOutgoingMessage(COMMANDS.start_game, oppositePlayerData);
                  process.stdout.write(`Start_game result: ${startGameResult}\n`);
                  client.send(opposResponse);

                  startGame(gameId);

                  setTurnUserId(gameId, indexPlayer);

                  const turnPlayerId = {
                    currentPlayer: indexPlayer,
                  };
                  const turnResponse = getOutgoingMessage(COMMANDS.turn, turnPlayerId);
                  process.stdout.write(`Turn result: ${turnResponse}\n`);
                  client.send(turnResponse);
                }
              }
            });

            const turnPlayerId = {
              currentPlayer: indexPlayer,
            };

            const turnResult = getOutgoingMessage(COMMANDS.turn, turnPlayerId);
            process.stdout.write(`Turn result: ${turnResult}\n`);
            ws.send(JSON.stringify(turnResult));
          }
          break;
        }
        case COMMANDS.randomAttack:
        case COMMANDS.attack: {
          const {
            data: { gameId, indexPlayer },
          } = convertedMessage;

          if (indexPlayer !== getTurnUserId(gameId)) {
            process.stdout.write('Should turn another player\n');
            return;
          }

          const resultAttack = doAttack(convertedMessage);

          const resAttackData = resultAttack.resData;
          const attackedPlayerId = resultAttack.partnerId;

          const attackResult = getOutgoingMessage(COMMANDS.attack, resAttackData);
          process.stdout.write(`Attack result: ${attackResult}\n`);
          ws.send(attackResult);

          wsServer.clients.forEach((client : any) => {
            if (client.readyState === WebSocket.OPEN) {
              if (client.userId === attackedPlayerId) {
                client.send(attackResult);
              }
            }
          });

          if (resAttackData.status === 'miss') {
            setTurnUserId(gameId, attackedPlayerId);
            const turnResult = getOutgoingMessage(
              COMMANDS.turn,
              { currentPlayer: attackedPlayerId },
            );
            process.stdout.write(`Turn result: ${turnResult}\n`);
            ws.send(turnResult);

            wsServer.clients.forEach((client: any) => {
              if (client.readyState === WebSocket.OPEN) {
                if (client.userId === attackedPlayerId) {
                  client.send(turnResult);
                }
              }
            });
          } else if (resAttackData.status === 'killed') {
            const { aroundCells } = resultAttack;
            for (let index = 0; index < aroundCells.length; index += 1) {
              const item = aroundCells[index];

              const killedResult = getOutgoingMessage(COMMANDS.attack, item as OutgoingData);
              process.stdout.write(`Attack result: ${killedResult}\n`);
              ws.send(killedResult);

              wsServer.clients.forEach((client: any) => {
                if (client.readyState === WebSocket.OPEN) {
                  if (client.userId === attackedPlayerId) {
                    client.send(killedResult);
                  }
                }
              });
            }

            const { finish } = resultAttack;
            if (finish) {
              process.stdout.write('finsh\n');
              setWinner(indexPlayer);
              const finishResp = getOutgoingMessage(COMMANDS.finish, { winPlayer: indexPlayer });

              ws.send(finishResp);

              wsServer.clients.forEach((client: any) => {
                if (client.readyState === WebSocket.OPEN) {
                  if (client.userId === attackedPlayerId) {
                    client.send(finishResp);
                  }
                }
              });

              const winnersResult = getOutgoingMessage(COMMANDS.update_winners, winners);
              process.stdout.write(`Update_winners result: ${winnersResult}\n`);

              wsServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(winnersResult);
                }
              });
            }
          }

          break;
        }

        default:
          process.stdout.write('default\n');
          break;
      }
    } catch (error) {
      process.stdout.write(`Error: ${error}\n`);
    }
  });

  ws.on('open', (message: RawData) => {
    process.stdout.write(`Open : ${message}\n`);
  });

  ws.on('close', (message) => {
    process.stdout.write(`Close : ${message}\n`);
  });

  ws.on('listening', () => {
    process.stdout.write(`Start ws server http server on the ${PORT} port!\n`);
  });
});
