import { WebSocket } from 'ws';
import User from '../user';

export interface UserWebSocket extends WebSocket, User {}
