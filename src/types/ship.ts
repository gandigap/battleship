export interface Ship {
  type: ShipType;
  position: Position;
  length: number;
  direction: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export enum PartShipState {
  healthy = 'healty',
  damaged = 'damaged',
}
interface PartShip extends Position {
  partShipState: PartShipState;
}

export interface ShipData {
  state: ShipState;
  parts: PartShip[];
}

export enum ShipState {
  healthy = 'healty',
  damaged = 'damaged',
  sunk = 'sunk',
}

export enum ShipType {
  small = 'small',
  medium = 'medium',
  large = 'large',
  huge = 'huge',
}

export enum AttackResult {
  miss = 'miss',
  killed = 'killed',
  shot = 'shot',
}
