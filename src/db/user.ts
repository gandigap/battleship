class User {
  private static userId = 0;

  name: string;

  password: string;

  userId: number;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
    this.userId = User.userId;
    console.log(`Create new user by id: ${User.userId}`);
    User.userId += 1;
  }
}

export default User;
