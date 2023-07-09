import Game from '../game';
import { UserWebSocket } from '../types';
import COMMANDS from '../types/commands';
import { StartGameData } from '../types/outcoming';
import { Ship } from '../types/ship';
import User from '../user';
// eslint-disable-next-line import/no-cycle
import getOutgoingMessage from '../utils/get-outgoing-message';

class Room {
  private static index = 0;

  roomId: number;

  roomUsers: User [];

  sockets: UserWebSocket [];

  game: Game;

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
      const gameDetails = {
        idGame: this.game.idGame,
        idPlayer: this.roomUsers.find(({ index }) => index !== ws.index)?.index as number,
      };
      const createGameResponse = getOutgoingMessage(COMMANDS.create_game, gameDetails);
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
        console.log(`Responded inside room: ${startGameResponse}`);
        ws.send(startGameResponse);
      });
    }
  }
}

export default Room;
