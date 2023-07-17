import { Winner } from '.';
import Room from '../db/room';
import { AttackStatus, Position, Ship } from './ship';

export type ErrorMessage = {
  error: boolean;
  errorText: string;
};

export interface RegisterData extends ErrorMessage {
  name: string;
  index: number;
}

export type UpdateRoomData = Room [];
export type UpdateWinnersData = Winner [];

export interface CreateGameData {
  idGame: number;
  idPlayer: number;
}

export interface StartGameData {
  currentPlayerIndex: number;
  ships: Ship[];
}

export interface CurrentPlayerData {
  currentPlayer: number;
}

export interface AttackData extends CurrentPlayerData {
  position: Position;
  status: AttackStatus;
}
export interface FinishData {
  winPlayer: number;
}

export type OutgoingData =
  | RegisterData
  | UpdateRoomData
  | UpdateWinnersData
  | CreateGameData
  | StartGameData
  | CurrentPlayerData
  | AttackData
  | FinishData;
