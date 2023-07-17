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
      winners.push({ name, wins: 0 });
      responseUserMessage.index = newUser.userId;
    }

    return responseUserMessage;
  } catch (error) {
    responseUserMessage.errorText = error instanceof Error ? error.message : 'Something was wromg!';
    responseUserMessage.error = true;

    return responseUserMessage;
  }
};

export const setWinner = (playerId: number) => {
  const user = users.get(playerId);
  const index = winners.findIndex((winner) => winner.name === user?.name);
  const winner = winners[index];
  if (winner) {
    const { name, wins } = winner;
    winners[index] = { name, wins: wins + 1 };
    winners.sort((winnerA, winnerB) => winnerB.wins - winnerA.wins);
  }
};
