import type { UserType } from "../schemas/user.schema.js";

export class User {
  private static instance: User;

  private users: UserType[] = [];

  private constructor() {}

  static getInstance() {
    if (!User.instance) {
      User.instance = new User();
    }
    return User.instance;
  }

  getUsers() {
    return this.users;
  }
}
