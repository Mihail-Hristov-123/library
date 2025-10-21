import type { BookResponseType } from "../schemas/book.schema";
import { BaseRepository } from "./base.repository";

export class BookRepository extends BaseRepository<BookResponseType> {
  protected tableName = "books" as const;

  deleteBookByTitle(title: string) {
    return this.db(this.tableName).delete().where({ title });
  }
}
