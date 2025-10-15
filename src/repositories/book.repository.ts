import db from "../config/knex.js";
import type { BookResponseType, BookType } from "../schemas/book.schema.js";

export class BookRepository {
  getAllBooks() {
    return db<BookResponseType[]>("books").select();
  }

  findBookByTitle(title: string) {
    return db<BookResponseType>("books").select().where({ title }).first();
  }

  updateBook(title: string, bookInfo: BookType) {
    return db("books").update(bookInfo).where({ title });
  }

  createBook(bookInfo: BookType, userId: number) {
    return db("books").insert({ ...bookInfo, publisher_id: userId });
  }

  removeBook(title: string) {
    return db("books").delete().where({ title });
  }
}
