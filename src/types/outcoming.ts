import User from '../user';
import { Winner } from '.';
import { Ship } from './ship';

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

export type OutgoingData =
  | RegisterData
  | UpdateRoomData
  | UpdateWinnersData
  | CreateGameData
  | StartGameData;
