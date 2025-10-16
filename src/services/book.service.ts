import z from "zod";
import { BookSchema, type BookType } from "../schemas/book.schema.js";
import { BookRepository } from "../repositories/book.repository.js";
import { CustomError } from "../CustomError.js";

export class BookManager {
  private static instance: BookManager;

  private booksRepository = new BookRepository();

  private constructor() {}

  static getInstance() {
    if (!BookManager.instance) {
      BookManager.instance = new BookManager();
    }
    return BookManager.instance;
  }

  getAllBooks() {
    return this.booksRepository.getAll();
  }

  findBook(title: string) {
    return this.booksRepository.getOneByProp("title", title);
  }

  findBooksByPublisher(userId: number) {
    return this.booksRepository.getOneByProp("publisher_id", userId);
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

    await this.booksRepository.updateById(bookFound.id, result.data);
  }

  async addBook(newBook: unknown, userId: number) {
    const result = BookSchema.safeParse(newBook);

    if (result.error) {
      throw new CustomError(
        "VALIDATION",
        `Error in book validation: ${z.prettifyError(result.error)}`
      );
    }

    await this.booksRepository.insert({ ...result.data, publisher_id: userId });
  }

  async removeBookByTitle(bookTitle: string) {
    await this.booksRepository.deleteBookByTitle(bookTitle);
  }
}
