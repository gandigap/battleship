export interface Ship {
  type: ShipType;
  position: Position;
  length: number;
  direction: boolean;
}

interface Position {
  x: number;
  y: number;
}

export enum PartState {
  Healthy = 'healty',
  Damaged = 'damaged',
}
interface Part extends Position {
  partState: PartState;
}

export interface ShipData {
  state: ShipState;
  parts: Part[];
}

export enum ShipState {
  Healthy = 'healty',
  Damaged = 'damaged',
  Sunk = 'sunk',
}

export enum ShipType {
  small = 'small',
  Medium = 'medium',
  Large = 'large',
  huge = 'huge',
}
