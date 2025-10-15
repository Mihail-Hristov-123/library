import db from "../config/knex.js";
import type { UserType } from "../schemas/user.schema.js";

export class UserRepository {
  create(userInfo: UserType) {
    return db("users").insert(userInfo);
  }

  findUser(userId: number) {
    return db("users").select().where({ id: userId }).first();
  }

  findUserByEmail(email: string) {
    return db("users").select().where({ email }).first();
  }
}
