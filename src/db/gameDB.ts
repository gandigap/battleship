import { IncomingAddShipsCommand } from '../types/incoming';
import { StartGameData } from '../types/outcoming';
import { AttackStatus } from '../types/ship';
import Board from './board';
import createCell from './cell';
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
      previousAttacks: [],
    },
  );

  return { idGame: gameId, idPlayer: userId };
};

export const addShipsToGame = (addShipsData: IncomingAddShipsCommand) => {
  const {
    data: { gameId, indexPlayer, ships },
  } = addShipsData;

  const currentGame = games.get(gameId);
  const currentBoard = currentGame?.boards.get(indexPlayer);

  if (currentBoard && currentGame) {
    currentBoard.ships = ships;
    currentGame.init += 1;
    return {
      init: currentGame.init,
      data: {
        ships: currentBoard.ships,
        currentPlayerIndex: indexPlayer,
      },
    };
  }
  return null;
};

export const getPlayerGameData = (gameId :number, playerId: number) => {
  const currentGame = games.get(gameId) as Game;
  const oppositePlayerData = {} as StartGameData;

  for (const board of currentGame.boards.values()) {
    if (board.indexPlayer !== playerId && oppositePlayerData) {
      oppositePlayerData.ships = board.ships;
      oppositePlayerData.currentPlayerIndex = board.indexPlayer;
    }
  }

  return oppositePlayerData;
};

export const startGame = (gameId : number) => {
  const currentGame = games.get(gameId) as Game;

  for (const board of currentGame.boards.values()) {
    board.cell = createCell(board.ships);
  }
};

export const setTurnUserId = (gameId: number, userId: number) => {
  const currentGame = games.get(gameId) as Game;
  currentGame.turnUserId = userId;
};

export const getTurnUserId = (gameId: number) => {
  const currentGame = games.get(gameId) as Game;
  return currentGame.turnUserId;
};

export const doAttack = (attackData : any) => {
  const {
    data: {
      gameId, indexPlayer, x, y,
    },
  } = attackData;
  const currentGame = games.get(gameId) as Game;

  let finish = true;
  let partnerId = 0;
  let currentBoard = {} as Board;

  for (const board of currentGame.boards.values()) {
    if (board.indexPlayer !== indexPlayer) {
      partnerId = board.indexPlayer;
      currentBoard = board;
    }
  }

  const indexCell = x * 10 + y;

  const currentCell = currentBoard.cell.get(indexCell);

  const aroundCells = [];
  const isBoardIncludesPreviuosAttack = currentBoard.previousAttacks.includes(`${x},${y}`);

  if (currentCell.isShip && !isBoardIncludesPreviuosAttack) {
    currentCell.attack += 1;

    const attackedShip = currentCell.ship;
    attackedShip.attack += 1;

    if (attackedShip.attack < attackedShip.length) {
      currentCell.status = AttackStatus.shot;
    } else {
      currentCell.status = AttackStatus.killed;

      let attackX = attackedShip.position.x - 1;
      let attackY = attackedShip.position.y - 1;

      let directionX = -1;
      let directionY = -1;

      for (let k = 0; k < 3; k += 1) {
        if (!attackedShip.direction) {
          directionX = 1;
          directionY = 0;
        } else {
          directionX = 0;
          directionY = 1;
        }

        for (let index = 0; index < attackedShip.length + 2; index += 1) {
          if ((
            (attackX >= 0 && attackX <= 9 && attackY >= 0 && attackY <= 9) && (k === 0 || k === 2)
          )
          || (
            (attackX >= 0 && attackX <= 9 && attackY >= 0 && attackY <= 9)
            && k === 1 && (index === 0 || index === attackedShip.length + 1)
          )) {
            currentBoard.cell.set(attackX * 10 + attackY, {
              attack: 1,
              status: AttackStatus.miss,
            });

            const missCell = {
              position: {
                x: attackX,
                y: attackY,
              },
              currentPlayer: indexPlayer,
              status: AttackStatus.miss,
            };

            aroundCells.push(missCell);
          } else if (
            (attackX >= 0 && attackX <= 9 && attackY >= 0 && attackY <= 9)
            && k === 1 && (index > 0 || index < attackedShip.length + 1)) {
            currentBoard.cell.set(attackX * 10 + attackY, {
              attack: 1,
              status: AttackStatus.killed,
            });

            const killedCell = {
              position: {
                x: attackX,
                y: attackY,
              },
              currentPlayer: indexPlayer,
              status: AttackStatus.killed,
            };

            aroundCells.push(killedCell);
          }

          attackX += directionX;
          attackY += directionY;
        }

        if (!attackedShip.direction) {
          attackX = attackedShip.position.x - 1;
          attackY += 1;
        } else {
          attackX += 1;
          attackY = attackedShip.position.y - 1;
        }
      }

      for (const cell of currentBoard.cell.values()) {
        if (cell.isShip && cell.status === '') {
          finish = false;
        }
      }
    }
  } else {
    currentCell.attack += 1;
    currentCell.status = AttackStatus.miss;
  }
  if (!isBoardIncludesPreviuosAttack)currentBoard.previousAttacks?.push(`${x},${y}`);

  const resData = {
    position: { x, y },
    currentPlayer: indexPlayer,
    status: currentCell.status,
  };

  return {
    resData, partnerId, aroundCells, finish,
  };
};
