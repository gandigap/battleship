import { Ship } from '../types/ship';

class Board {
  gameId: number;

  turnUserId: number;

  ships: Ship[];

  indexPlayer: number;

  cell?: any;

  previousAttacks: string[];

  pseudoRandom: string[];

  constructor(
    gameId:number,
    turnUserId: number,
    ships: Ship[],
    userId: number,
    pseudoRandom: string [],
    previousAttacks = [],
  ) {
    this.gameId = gameId;
    this.turnUserId = turnUserId;
    this.ships = ships;
    this.indexPlayer = userId;
    this.pseudoRandom = pseudoRandom;
    this.previousAttacks = previousAttacks;
  }

  removePseudoRandom(value: string) {
    this.pseudoRandom = this.pseudoRandom.filter((randomValue) => (
      randomValue !== value
    ));
  }
}

export default Board;
