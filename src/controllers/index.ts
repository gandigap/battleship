import UsersDB from '../db';
import { COMMANDS, ConvertedMessage } from '../types';

class Controller {
  userDB: UsersDB;

  constructor() {
    this.userDB = new UsersDB();
  }

  implementMessage(convertedMessage: ConvertedMessage) {
    const { type } = convertedMessage;
    switch (type) {
      case COMMANDS.reg:
        console.log('reg', this.userDB);
        break;

      default:
        console.log('default');
        break;
    }
  }
}

export default Controller;
