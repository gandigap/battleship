import { Winner } from '../types';
import User from '../user';
import { IncomingRegisterCommand } from '../types/incoming';

class UsersDB {
  private users: Map<number, User>;

  private winners: Winner [];

  constructor() {
    this.users = new Map();
    this.winners = [];
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
        this.winners.push({ name, wins: 0 });
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

  markTheWinner(playerId: number) {
    const user = this.users.get(playerId);
    this.winners = this.winners
      .map(({ name, wins }) => (name === user?.name ? { name, wins: wins + 1 } : { name, wins }))
      .sort((winnerA, winnerB) => winnerB.wins - winnerA.wins);
  }
}

export default UsersDB;
