import {
  PartState, Ship, ShipData, ShipState,
} from '../types/ship';

class Game {
  private static index = 0;

  idGame: number;

  ships : Map<number, Ship[]>;

  isStarted: boolean;

  shipsData: Map<number, ShipData[]>;

  currentPlayer: number;

  constructor() {
    this.idGame = Game.index;
    Game.index += 1;
    this.isStarted = false;
    this.ships = new Map<number, Ship[]>();
    this.shipsData = new Map<number, ShipData[]>();
  }

  startGame() {
    this.isStarted = true;
    this.ships.forEach((playerShips, playerId) => {
      const playerShipData: ShipData[] = [];
      playerShips.forEach(({ length, direction, position: { x, y } }) => {
        const shipData: ShipData = { state: ShipState.Healthy, parts: [] };
        for (let i = 0; i < length; i += 1) {
          shipData.parts.push({
            partState: PartState.Healthy,
            x: direction ? x : x + i,
            y: direction ? y + i : y,
          });
        }
        playerShipData.push(shipData);
      });
      this.shipsData.set(playerId, playerShipData);
    });
  }

  setCurrentPlayer(id: number) {
    this.currentPlayer = id;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }
}

export default Game;
