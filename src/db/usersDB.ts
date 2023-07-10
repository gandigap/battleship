import { Winner } from '../types';
import { IncomingRegisterCommand } from '../types/incoming';
import User from './user';

export const users = new Map< number, User>();
export const winners : Winner [] = [];

export const playerAutorization = (message: IncomingRegisterCommand) => {
  const { name, password } = message.data;

  const responseUserMessage = {
    name,
    index: -1,
    error: false,
    errorText: '',
  };

  try {
    let verifyUser;

    for (const user of users.values()) {
      if (user.name === name) {
        verifyUser = user;
      }
    }

    if (verifyUser) {
      const userPassword = verifyUser.password;

      if (userPassword === password) {
        responseUserMessage.index = verifyUser.userId;
      } else {
        responseUserMessage.errorText = 'User exist and password is wrong';
        responseUserMessage.error = true;
      }
    } else {
      const newUser = new User(name, password);

      users.set(newUser.userId, newUser);
      winners.push();
      responseUserMessage.index = newUser.userId;
    }

    console.log(users);

    return responseUserMessage;
  } catch (error) {
    responseUserMessage.errorText = error instanceof Error ? error.message : 'Something was wromg!';
    responseUserMessage.error = true;

    return responseUserMessage;
  }
};

//   getWinners() {
//     return Array.from(this.winners.values());
//   }

//   markTheWinner(playerId: number) {
//     const user = this.users.get(playerId);
//     this.winners = this.winners
//       .map(({ name, wins }) => (name === user?.name ? { name, wins: wins + 1 } : { name, wins }))
//       .sort((winnerA, winnerB) => winnerB.wins - winnerA.wins);
//   }
// }

// export default UsersDB;
