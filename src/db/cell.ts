import { Ship } from '../types/ship';

export type CellData = {
  status: string,
  isShip: boolean,
  ship: Partial<Ship>,
  attack: number,
};

export const createCell = (ships: Ship []) => {
  const cell = new Map<number, CellData>();
  let destinationX = 0;
  for (let x = 0; x < 10; x += 1) {
    destinationX = x * 10;

    for (let y = 0; y < 10; y += 1) {
      cell.set(destinationX + y, {
        status: '',
        isShip: false,
        ship: {},
        attack: 0,
      });
    }
  }

  for (let item = 0; item < ships.length; item += 1) {
    const ship = ships[item] as Ship;
    ship.attack = 0;

    let positionX = ship.position.x;
    let positionY = ship.position.y;

    let directionX = -1;
    let directionY = -1;

    if (!ship.direction) {
      directionX = 1;
      directionY = 0;
    } else {
      directionX = 0;
      directionY = 1;
    }

    for (let index = 0; index < ship.length; index += 1) {
      cell.set(positionX * 10 + positionY, {
        attack: 0,
        status: '',
        isShip: true,
        ship,
      });

      positionX += directionX;
      positionY += directionY;
    }
  }

  return cell;
};
