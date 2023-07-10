import { WebSocket } from 'ws';

export interface UserWebSocket extends WebSocket {
  [x: string]: any;
}

export interface Winner {
  name: string;
  wins: number;
}
