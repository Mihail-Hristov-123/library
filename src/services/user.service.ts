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

  findUser(id: number) {
    return this.userRepository.findUser(id);
  }

  findUserByEmail(email: string) {
    return this.userRepository.findUserByEmail(email);
  }

  async checkEmailTaken(email: string) {
    return Boolean(await this.userRepository.findUserByEmail(email));
  }

  async createUser(userInfo: unknown) {
    const { error, data } = UserSchema.safeParse(userInfo);
    if (error) {
      throw new CustomError(
        "VALIDATION",
        `Error occurred during user info validation: ${z.prettifyError(error)}`
      );
    }

    const { email, name, password } = data;
    const emailUsed = await this.checkEmailTaken(email);

    if (emailUsed) {
      throw new CustomError("CONFLICT", `Email ${email} is already used`);
    }

    let hashedPass;
    try {
      hashedPass = await bcrypt.hash(password, 10);
    } catch (error) {
      throw new CustomError("SERVER", `Password hashing error: ${error}`);
    }

    const [user] = await this.userRepository.create({
      email,
      name,
      password: hashedPass,
    });
    return user;
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

    try {
      const passwordCorrect = await bcrypt.compare(password, account.password);
      return passwordCorrect;
    } catch (error) {
      throw new CustomError("SERVER", `Password verification error: ${error}`);
    }
  }
}
