export interface Ship {
  position: Position;
  length: number;
  direction: boolean;
  attack: number;
}

export interface Position {
  x: number;
  y: number;
}

export enum AttackStatus {
  miss = 'miss',
  killed = 'killed',
  shot = 'shot',
}
