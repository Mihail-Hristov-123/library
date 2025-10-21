import { type UserResponseType } from "../schemas/user.schema";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<UserResponseType> {
  protected tableName = "users" as const;

  getFullInfo(userId: number) {
    return this.db(this.tableName)
      .select("users.*", this.db.raw("json_agg(books.*) as publications"))
      .leftJoin("books", "books.publisher_id", "users.id")
      .where("users.id", userId)
      .groupBy("users.id")
      .first();
  }
}
