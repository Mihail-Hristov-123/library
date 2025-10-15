import z from "zod";
import { UserSchema } from "../schemas/user.schema.js";
import * as bcrypt from "bcrypt";
import { LoginSchema } from "../schemas/login.schema.js";
import { CustomError } from "../CustomError.js";
import { UserRepository } from "../repositories/user.repository.js";

export class UserManager {
  private static instance: UserManager;

  userRepository = new UserRepository();

  private constructor() {}

  static getInstance() {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  async findUser(id: number) {
    return await this.userRepository.findUser(id);
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findUserByEmail(email);
  }

  async checkEmailTaken(email: string) {
    return Boolean(await this.userRepository.findUserByEmail(email));
  }

  async createUser(userInfo: unknown) {
    const { error, data } = UserSchema.safeParse(userInfo);
    if (error) {
      throw new CustomError("VALIDATION", z.prettifyError(error));
    }

    const { email, name, password } = data;
    const emailUsed = await this.checkEmailTaken(email);

    if (emailUsed) {
      throw new CustomError("CONFLICT", `Email ${email} is already used`);
    }

    const hashedPass = await bcrypt.hash(password, 10);
    await this.userRepository.create({ email, name, password: hashedPass });

    return { name, email };
  }

  async checkCredentials(loginData: unknown) {
    const { error, data } = LoginSchema.safeParse(loginData);

    if (error) {
      throw new CustomError("VALIDATION", z.prettifyError(error));
    }
    const { email, password } = data;

    const account = await this.findUserByEmail(email);

    if (!account) {
      throw new CustomError("AUTHENTICATION", `Account not found`);
    }

    const passwordCorrect = await bcrypt.compare(password, account.password);
    return passwordCorrect;
  }
}
