import z from "zod";
import { BookSchema, type BookType } from "../schemas/book.schema.js";
import { error } from "console";

export class Book {
  private static instance: Book;

  private books: BookType[] = [];

  private constructor() {}

  static getInstance() {
    if (!Book.instance) {
      Book.instance = new Book();
    }
    return Book.instance;
  }

  displayBooks() {
    return this.books;
  }

  findBook(title: string) {
    const result = this.books.find((book) => book.title == title);
    if (!result) throw new Error(`Book with title ${title} was not found`);

    return result;
  }

  addBook(newBook: unknown) {
    const result = BookSchema.safeParse(newBook);
    if (!result.success) {
      console.error(`Book validation error:`, result.error);
      throw new Error("Book addition error");
    }

    this.books.push(result.data);
    console.log(`Book successfully added to library`);
  }

  removeBookByTitle(bookTitle: string) {
    if (this.findBook(bookTitle)) {
      this.books = this.books.filter((book) => book.title != bookTitle);
      console.log(`${bookTitle} was successfully removed from the library`);
    }
  }
}
