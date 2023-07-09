import COMMANDS from './commands';
import { Ship } from './ship';

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

export interface Identification {
  id: number;
}
export interface IncomingAddPlayerToRoomCommand extends Identification {
  type: COMMANDS.add_user_to_room;
  data: AddPlayerToRoomData;
}

export interface IncomingRegisterCommand extends Identification {
  type: COMMANDS.reg;
  data: LoginData;
}

export interface IncomingCreateRoomCommand extends Identification {
  type: COMMANDS.create_room;
  data: '';
}

export interface AddShipsData extends GeneralGameData {
  ships: Ship[];
}

export interface IncomingAddShipsCommand extends Identification {
  type: COMMANDS.add_ships;
  data: AddShipsData;
}

export type IncomingData =
| IncomingRegisterCommand
| IncomingCreateRoomCommand
| IncomingAddPlayerToRoomCommand
| IncomingAddShipsCommand;
