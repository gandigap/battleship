import User from '../user';

export interface RegisterData extends User {
  error: boolean;
  errorText: string;
}

export type OutgoingData =
  | RegisterData;
