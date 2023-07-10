import Board from './board';

class Game {
  private static gameId = 0;

  boards: Map <number, Board>;

  init: number;

  gameId: number;

  constructor(boards: Map <number, Board>, init: number) {
    this.boards = boards;
    this.init = init;
    this.gameId = Game.gameId;
    console.log(`Create new game by id: ${Game.gameId}`);
    Game.gameId += 1;
  }
}

export default Game;
