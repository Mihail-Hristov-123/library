import z from "zod";
import { BookSchema, type BookType } from "../schemas/book.schema.js";

export class BookManager {
  private static instance: BookManager;

  private books: BookType[] = [];

  private constructor() {}

  static getInstance() {
    if (!BookManager.instance) {
      BookManager.instance = new BookManager();
    }
    return BookManager.instance;
  }

  getAllBooks() {
    return this.books;
  }

  findBook(title: string) {
    return this.books.find((book) => book.title == title);
  }

  findBookIndex(title: string) {
    return this.books.findIndex((book) => book.title == title);
  }

  updateBook(title: string, newInfo: unknown) {
    const bookIndex = this.findBookIndex(title);

    if (bookIndex === -1) {
      throw new Error(`Here- Book ${title} was not found`);
    }
    const book = this.books[bookIndex];

    const newContent = typeof newInfo === "object" ? { ...newInfo } : {};

    const result = BookSchema.safeParse({ ...book, ...newContent });

    if (!result.success) {
      console.error(`Book validation error:`, result.error);
      throw new Error("Book updating error");
    }

    this.books[bookIndex] = result.data;

    console.log(`${title} was successfully updated`);
  }

  addBook(newBook: unknown) {
    const result = BookSchema.safeParse(newBook);

    if (!result.success) {
      console.error(`Book validation error:`, result.error);
      throw new Error(`Book addition error: ${z.prettifyError(result.error)}`);
    }

    const title = result.data.title;

    if (this.findBook(title)) {
      throw new Error(`Book ${title} already exists`);
    }

    this.books.push(result.data);
    console.log(`Book ${title} successfully added to library`);
  }

  removeBookByTitle(bookTitle: string) {
    const index = this.findBookIndex(bookTitle);
    if (index === -1) {
      throw new Error(`Book ${bookTitle} was not found`);
    }
    this.books.splice(index, 1);
    console.log(`${bookTitle} was successfully removed from the library`);
  }
}
