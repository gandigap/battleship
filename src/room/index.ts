import Game from '../game';
import { UserWebSocket } from '../types';
import COMMANDS from '../types/commands';
import { CreateGameData, StartGameData } from '../types/outcoming';
import { AttackResult, Position, Ship } from '../types/ship';
import User from '../user';
// eslint-disable-next-line import/no-cycle
import getOutgoingMessage from '../utils/get-outgoing-message';

class Room {
  private static index = 0;

  roomId: number;

  roomUsers: User [];

  sockets: UserWebSocket [];

  game: Game;

  endOfGame = false;

  attackInProcess = false;

  constructor(ws :UserWebSocket) {
    this.roomUsers = [];
    this.sockets = [];
    const { name, index } = ws;
    this.roomId = Room.index;
    this.roomUsers.push({ name, index });
    this.sockets.push(ws);
    Room.index += 1;
  }

  createGame() {
    this.game = new Game();
    this.sockets.forEach((ws) => {
      const gameDetails: CreateGameData = {
        idGame: this.game.idGame,
        idPlayer: ws.index,
      };
      const createGameResponse = getOutgoingMessage(COMMANDS.create_game, gameDetails);
      console.log(`Responded inside room: ${createGameResponse}`);
      ws.send(createGameResponse);
    });
  }

  setPlayerShips(playerIndex: number, ships: Ship[]) {
    if (this.game.ships.size === 0) {
      this.game.setCurrentPlayer(playerIndex);
    }

    this.game.ships.set(playerIndex, ships);

    if (this.game.ships.size === 2) {
      this.game.startGame();
      const currentPlayerIndex = this.game.getCurrentPlayer();

      this.sockets.forEach((ws) => {
        const gameDetails: StartGameData = {
          currentPlayerIndex,
          ships: this.game.ships.get(ws.index) as Ship[],
        };
        const startGameResponse = getOutgoingMessage(COMMANDS.start_game, gameDetails);
        ws.send(startGameResponse);
      });
    }
  }

  handleAttack(playerId: number, target: Position | null): boolean {
    if (this.attackInProcess || this.endOfGame) {
      return false;
    }
    const currentPlayerId = this.game.getCurrentPlayer();

    if (currentPlayerId !== playerId) {
      return false;
    }

    this.attackInProcess = true;
    const enemyId = this.getOtherPlayer(playerId);
    const result = this.game.handleAttack(playerId, enemyId, target);
    this.endOfGame = this.game.checkEndOfGame(enemyId);

    this.sockets.forEach((ws) => {
      const attackResponse = getOutgoingMessage(COMMANDS.attack, result);

      ws.send(attackResponse);

      if (result.status === AttackResult.miss) {
        this.game.setCurrentPlayer(enemyId);
        const changeTurnResponse = getOutgoingMessage(COMMANDS.turn, { currentPlayer: enemyId });

        ws.send(changeTurnResponse);
      }

      if (this.endOfGame) {
        const endOfGameResponse = getOutgoingMessage(COMMANDS.finish, { winPlayer: playerId });

        ws.send(endOfGameResponse);
      }
    });
    this.attackInProcess = false;
    return this.endOfGame;
  }

  doEndGame(loserId: number) {
    const winnerId = this.getOtherPlayer(loserId);
    const winnerWs = this.sockets.find(({ index }) => index === winnerId) as UserWebSocket;

    if (!this.game.isStarted) {
      const gameDetails: StartGameData = {
        currentPlayerIndex: winnerId,
        ships: this.game.ships.get(winnerId) as Ship[],
      };
      const startGameResponse = getOutgoingMessage(COMMANDS.start_game, gameDetails);

      winnerWs.send(startGameResponse);
    }

    const endOfGameResponse = getOutgoingMessage(COMMANDS.finish, { winPlayer: winnerId });

    winnerWs.send(endOfGameResponse);

    return winnerId;
  }

  private getOtherPlayer(currentPlayerId: number) {
    return this.roomUsers.find(({ index }) => index !== currentPlayerId)?.index as number;
  }
}

export default Room;
