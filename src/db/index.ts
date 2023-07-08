import { WebSocket } from 'ws';

import { UserWebSocket } from '../types';
import User from '../user';
import { IncomingData } from '../types/incoming';

class UsersDB {
  private users: User [];

  constructor() {
    console.log(' New user DB');
    this.users = [];
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

    return {
      ...user,
      error: false,
      errorText: '',
    };
  }

  getExistUser(currentUserName: string) {
    return this.users.find(({ name }) => currentUserName === name);
  }
}

export default UsersDB;
