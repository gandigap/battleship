import User from '../user';
import Room from '../room';
import { Winner } from '.';

export interface RegisterData extends User {
  error: boolean;
  errorText: string;
}

export type UpdateRoomData = Room [];
export type UpdateWinnersData = Winner [];

export type OutgoingData =
  | RegisterData
  | UpdateRoomData
  | UpdateWinnersData;
