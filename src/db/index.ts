import { User } from '../types';

class UsersDB {
  private users: User [];

  constructor() {
    console.log(' New user DB');
    this.users = [];
  }

  addUser(data : User) {
    console.log(data);
    this.users.push(data);
  }
}

export default UsersDB;
