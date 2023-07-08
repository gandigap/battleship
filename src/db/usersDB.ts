import { WebSocket } from 'ws';

import { UserWebSocket, Winner } from '../types';
import User from '../user';
import { IncomingData } from '../types/incoming';

class UsersDB {
  private users: User [];

  private winners: Winner[];

  constructor() {
    console.log(' New user DB');
    this.users = [];
    this.winners = [];
  }

  addUser(message : IncomingData, ws: WebSocket) {
    const {
      data: { name, password },
    } = message;

    const existUser = this.getExistUser(name);

    if (existUser) {
      if (existUser.password === password) {
        (ws as UserWebSocket).name = existUser.name;
        (ws as UserWebSocket).index = existUser.index;

        return {
          error: false,
          ...existUser,
          errorText: '',

        };
      } return {
        error: true,
        ...existUser,

        errorText: 'Password is wrong!',
      };
    }

    const user = new User(name, password);

    (ws as UserWebSocket).name = user.name;
    (ws as UserWebSocket).index = user.index;

    this.users.push(user);
    this.winners.push({ name, wins: 0 });

    return {
      ...user,
      error: false,
      errorText: '',
    };
  }

  getExistUser(currentUserName: string) {
    return this.users.find(({ name }) => currentUserName === name);
  }

  getWinners() {
    return this.winners;
  }
}

export default UsersDB;
