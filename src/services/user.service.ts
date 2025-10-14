import z from "zod";
import { UserSchema, type UserType } from "../schemas/user.schema.js";
import * as bcrypt from "bcrypt";
import { LoginSchema } from "../schemas/login.schema.js";
import { CustomError } from "../CustomError.js";

export class UserManager {
  private static instance: UserManager;

  private users: UserType[] = [];

  private constructor() {}

  static getInstance() {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  private findUser(email: string) {
    return this.users.find((user) => user.email === email);
  }

  async createUser(userInfo: unknown) {
    const { error, data } = UserSchema.safeParse(userInfo);
    if (error) {
      throw new CustomError("VALIDATION", z.prettifyError(error));
    }

    const { email, name, password } = data;
    if (this.users.find((user) => user.email === email)) {
      throw new CustomError("CONFLICT", `Email ${email} is already used`);
    }

    const hashedPass = await bcrypt.hash(password, 10);
    this.users.push({
      ...data,
      password: hashedPass,
    });

    return { name, email };
  }

  async checkCredentials(loginData: unknown) {
    const { error, data } = LoginSchema.safeParse(loginData);

    if (error) {
      throw new CustomError("VALIDATION", z.prettifyError(error));
    }
    const { email, password } = data;

    const account = this.findUser(email);

    if (!account) {
      throw new CustomError("AUTHENTICATION", `Account not found`);
    }

    const passwordCorrect = await bcrypt.compare(password, account.password);
    return passwordCorrect;
  }
}
