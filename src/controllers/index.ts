import { WebSocket } from 'ws';

import UsersDB from '../db';
import COMMANDS from '../types/commands';
import getOutgoingMessage from '../utils/get-outgoing-message';
import { LoginMessage } from '../types/incoming';

class Controller {
  userDB: UsersDB;

  constructor() {
    this.userDB = new UsersDB();
  }

  implementMessage(convertedMessage: LoginMessage, ws : WebSocket) {
    const { type } = convertedMessage;
    console.log('implementMessage', convertedMessage);
    switch (type) {
      case COMMANDS.reg: {
        const message = this.userDB.addUser(convertedMessage, ws);
        const addUserMessage = getOutgoingMessage(COMMANDS.reg, message);

        ws.send(addUserMessage);
        break;
      }

      default:
        console.log('default');
        break;
    }
  }
}

export default Controller;
