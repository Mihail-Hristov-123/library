import z from "zod";
import { BookSchema, type BookType } from "../schemas/book.schema.js";
import { BookRepository } from "../repositories/book.repository.js";

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

  async findBook(title: string) {
    return await this.booksRepository.findBookByTitle(title);
  }

  async updateBook(title: string, newInfo: unknown) {
    const bookFound = await this.findBook(title);

    const newContent = typeof newInfo === "object" ? { ...newInfo } : {};

    const result = BookSchema.safeParse({ ...bookFound, ...newContent });

    if (!result.success) {
      console.error(`Book validation error:`, result.error);
      throw new Error("Book updating error");
    }

    await this.booksRepository.updateBook(title, result.data);
  }

  async addBook(newBook: unknown, userId: number) {
    const result = BookSchema.safeParse(newBook);

    if (!result.success) {
      console.error(`Book validation error:`, result.error);
      throw new Error(`Book addition error: ${z.prettifyError(result.error)}`);
    }

    await this.booksRepository.createBook(result.data, userId);
  }

  async removeBookByTitle(bookTitle: string) {
    await this.booksRepository.removeBook(bookTitle);
  }
}
