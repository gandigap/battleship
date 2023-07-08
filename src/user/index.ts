class User {
  private static index = 0;

  name: string;

  password: string;

  index: number;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
    this.index = User.index;

    User.index += 1;
  }
}

export default User;
