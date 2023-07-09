import User from '../user';
import { Winner } from '.';
import { AttackResult, Position, Ship } from './ship';

export type ErrorMessage = {
  error: boolean;
  errorText: string;
};

export interface RegisterData extends ErrorMessage {
  name: string;
  index: number;
}

export type UpdateRoomData = UpdateRoom [];
export type UpdateWinnersData = Winner [];

export interface CreateGameData {
  idGame: number;
  idPlayer: number;
}

export interface UpdateRoom {
  roomId: number;
  roomUsers: User[];
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
  status: AttackResult;
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
