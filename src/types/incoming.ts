import COMMANDS from './commands';

export type LoginData = {
  name: string;
  password: string;
};

export type LoginMessage = {
  type: COMMANDS;
  data: LoginData;
};

export type IncomingData =
    | LoginMessage;
