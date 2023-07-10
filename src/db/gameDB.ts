import Game from './game';

const games = new Map<number, Game>();

export const createGame = () => {
  const game = new Game(new Map(), 0);
  games.set(game.gameId, game);

  return game.gameId;
};

export const newGameUser = (gameId :number, userId:number) => {
  const game = games.get(gameId);

  game?.boards.set(
    userId,
    {
      gameId,
      turnUserId: 0,
      ships: [],
      indexPlayer: userId,
    },
  );

  return { idGame: gameId, idPlayer: userId };
};
