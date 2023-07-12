import COMMANDS from './commands';
import { Position, Ship } from './ship';

export type LoginData = {
  name: string;
  password: string;
};

export interface GeneralGameData {
  gameId: number;
  indexPlayer: number;
}

export interface AddPlayerToRoomData {
  indexRoom: number;
}

export interface IncomingAddPlayerToRoomCommand {
  type: COMMANDS.add_user_to_room;
  data: AddPlayerToRoomData;
}

export interface IncomingRegisterCommand {
  type: COMMANDS.reg;
  data: LoginData;
}

export interface IncomingCreateRoomCommand {
  type: COMMANDS.create_room;
  data: '';
}

export interface AddShipsData extends GeneralGameData {
  ships: Ship[];
}

export interface IncomingAddShipsCommand {
  type: COMMANDS.add_ships;
  data: AddShipsData;
}

export interface IncomingAttackCommand {
  type: COMMANDS.attack;
  data: AttackData;
}

export interface AttackData extends GeneralGameData, Position {}

export type IncomingData =
| IncomingRegisterCommand
| IncomingCreateRoomCommand
| IncomingAddPlayerToRoomCommand
| IncomingAddShipsCommand
| IncomingAttackCommand;
