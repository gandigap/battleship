import { Ship } from '../types/ship';

class Board {
  gameId: number;

  turnUserId: number;

  ships: Ship[];

  indexPlayer: number;

  constructor(gameId:number, turnUserId: number, ships: Ship[], userId: number) {
    this.gameId = gameId;
    this.turnUserId = turnUserId;
    this.ships = ships;
    this.indexPlayer = userId;
    console.log(`Create new board by id: ${gameId}`);
  }
}

export default Board;
