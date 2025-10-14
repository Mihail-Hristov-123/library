import db from "../config/knex.js";
import type { UserType } from "../schemas/user.schema.js";

export class UserRepository {
  async create(userInfo: UserType) {
    try {
      await db("users").insert(userInfo);
    } catch (error) {
      console.error(`Error during user creation: ${error}`);
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      return await db("users").select().where({ email }).first();
    } catch (error) {
      console.error(`Error during user retrieval: ${error}`);
      throw error;
    }
  }
}
