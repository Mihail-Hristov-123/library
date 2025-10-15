import db from "../config/knex.js";
import {
  type UserResponseType,
  type UserType,
} from "../schemas/user.schema.js";

export class UserRepository {
  create(userInfo: UserType) {
    return db("users").insert(userInfo).returning("*");
  }

  findUser(userId: number) {
    return db<UserResponseType>("users").select().where({ id: userId }).first();
  }

  findUserByEmail(email: string) {
    return db<UserResponseType>("users").select().where({ email }).first();
  }
}
