import {
  AttackResult,
  PartShipState, Position, Ship, ShipData, ShipState,
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
        const shipData: ShipData = { state: ShipState.healthy, parts: [] };
        for (let i = 0; i < length; i += 1) {
          shipData.parts.push({
            partShipState: PartShipState.healthy,
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

  handleAttack(currentPlayer: number, enemyId: number, possibleTarget: Position | null) {
    const position = possibleTarget;

    const status = this.processAttack(enemyId, position);

    return {
      currentPlayer,
      position,
      status,
    };
  }

  processAttack(enemyId: number, target: Position | null): AttackResult {
    const enemyShipData = this.shipsData.get(enemyId) as ShipData[];
    let status = AttackResult.miss;
    const updatedShipData = enemyShipData.map(({ state, parts }) => {
      let updatedShipState = state;
      let updatedParts = parts.map(({ partShipState, x, y }) => {
        let updatedPartState = partShipState;
        if (target?.x === x && target.y === y) {
          updatedPartState = PartShipState.damaged;
          updatedShipState = ShipState.damaged;
          status = AttackResult.shot;
        }
        return {
          partShipState: updatedPartState,
          x,
          y,
        };
      });

      if (updatedParts.length > 0 && updatedParts.every(
        ({ partShipState }) => partShipState === PartShipState.damaged,
      )) {
        updatedParts = [];
        updatedShipState = ShipState.sunk;
        status = AttackResult.killed;
      }

      return {
        state: updatedShipState,
        parts: updatedParts,
      };
    });

    this.shipsData.set(enemyId, updatedShipData);
    return status;
  }

  checkEndOfGame(enemyId: number): boolean {
    const enemyShipData = this.shipsData.get(enemyId) as ShipData[];
    return enemyShipData.every(({ state }) => state === ShipState.sunk);
  }
}

export default Game;
