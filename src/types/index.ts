export type User = {
  name: string;
  password: string
};

export type ConvertedMessage = {
  data?: User | string,
  type?: COMMANDS,
  id?:number };

export enum COMMANDS {
  reg = 'reg',
  create_game = 'create_game',
  start_game = 'start_game',
  turn = 'turn',
  attack = 'attack',
  finish = 'attack',
  update_room = 'update_room',
  update_winners = 'update_winners',
}
