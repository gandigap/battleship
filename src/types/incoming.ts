import COMMANDS from './commands';

export type LoginData = {
  name: string;
  password: string;
};

export type LoginMessage = {
  type: COMMANDS.reg;
  data: LoginData;
};

export type IncomingData =
    | LoginMessage;
