import z from "zod";
import { BookSchema, type BookType } from "../schemas/book.schema.js";
import { BookRepository } from "../repositories/book.repository.js";
import { CustomError } from "../CustomError.js";

export class BookManager {
  private static instance: BookManager;

  booksRepository = new BookRepository();

  private constructor() {}

  static getInstance() {
    if (!BookManager.instance) {
      BookManager.instance = new BookManager();
    }
    return BookManager.instance;
  }

  getAllBooks() {
    return this.booksRepository.getAllBooks();
  }

  findBook(title: string) {
    return this.booksRepository.findBookByTitle(title);
  }

  async updateBook(title: string, newInfo: unknown) {
    const bookFound = await this.findBook(title);

    if (!bookFound) {
      throw new CustomError(
        "NOT_FOUND",
        `Book ${title} was not found - it cannot be updated`
      );
    }

    if (typeof newInfo !== "object") {
      throw new CustomError("CLIENT", "Incorrect request body type");
    }

    const result = BookSchema.safeParse({ ...bookFound, ...newInfo });

    if (result.error) {
      throw new CustomError(
        "VALIDATION",
        `Error occurred during book update: ${z.prettifyError(result.error)}`
      );
    }

    await this.booksRepository.updateBook(title, result.data);
  }

  async addBook(newBook: unknown, userId: number) {
    const result = BookSchema.safeParse(newBook);

    if (result.error) {
      throw new CustomError(
        "VALIDATION",
        `Error in book validation: ${z.prettifyError(result.error)}`
      );
    }

    await this.booksRepository.createBook(result.data, userId);
  }

  async removeBookByTitle(bookTitle: string) {
    await this.booksRepository.removeBook(bookTitle);
  }
}
