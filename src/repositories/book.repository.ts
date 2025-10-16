import db from "../config/knex.js";
import type { BookResponseType, BookType } from "../schemas/book.schema.js";
import { BaseRepository } from "./base.repository.js";

export class BookRepository extends BaseRepository<BookResponseType> {
  protected tableName = "books" as const;

  deleteBookByTitle(title: string) {
    return db(this.tableName).delete().where({ title });
  }
}
