import { Winner } from '../types';
import User from '../user';
import { IncomingRegisterCommand } from '../types/incoming';

class UsersDB {
  private users: Map<number, User>;

  private winners: Map<number, Winner >;

  constructor() {
    this.users = new Map();
    this.winners = new Map();
  }

  authorization(message : IncomingRegisterCommand) {
    const {
      data: { name, password },
    } = message;

    const userResponse = {
      name,
      index: -1,
      error: false,
      errorText: '',
    };

    try {
      let validateUser;
      /* eslint-disable-next-line */
      for (const item of this.users.values()) {
        if (item.name === name) {
          validateUser = item;
        }
      }

      if (validateUser) {
        const userPassword = validateUser.password;

        if (userPassword === password) {
          userResponse.index = validateUser.index;
        } else {
          userResponse.error = true;
          userResponse.errorText = 'Password is wrong!';
        }
      } else {
        const user = new User(name, password);

        this.users.set(user.index, user);
        this.winners.set(user.index, { name, wins: 0 });
        userResponse.index = user.index;
      }

      return userResponse;
    } catch (error) {
      let errorMessage = 'Something failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      userResponse.error = true;
      userResponse.errorText = errorMessage;

      return userResponse;
    }
  }

  getWinners() {
    return Array.from(this.winners.values());
  }
}

export default UsersDB;
