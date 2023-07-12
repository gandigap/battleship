import { Ship } from '../types/ship';

class Board {
  gameId: number;

  turnUserId: number;

  ships: Ship[];

  indexPlayer: number;

  cell?: any;

  previousAttacks: string[];

  constructor(
    gameId:number,
    turnUserId: number,
    ships: Ship[],
    userId: number,
    previousAttacks = [],
  ) {
    this.gameId = gameId;
    this.turnUserId = turnUserId;
    this.ships = ships;
    this.indexPlayer = userId;
    this.previousAttacks = previousAttacks;
  }
}

export default Board;
