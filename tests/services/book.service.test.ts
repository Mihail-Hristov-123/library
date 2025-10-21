import { BookSchema } from "@/schemas/book.schema";
import { BookRepository } from "@/repositories/book.repository";
import { CustomError } from "@/CustomError";
import { BookManager } from "@/services/book.service";

jest.mock("@/repositories/book.repository");

const mockBookRepo = BookRepository as jest.MockedClass<typeof BookRepository>;

describe("BookManager", () => {
  let bookManager: BookManager;
  let bookRepositoryMock: jest.Mocked<BookRepository>;

  beforeEach(() => {
    //@ts-ignore
    bookRepositoryMock = new mockBookRepo();
    bookManager = new BookManager();

    // @ts-ignore
    bookManager.booksRepository = bookRepositoryMock;

    jest.clearAllMocks();

    jest.spyOn(BookSchema, "safeParse");
  });

  describe("getAllBooks", () => {
    it("should call booksRepository.getAll and return books", async () => {
      const fakeBooks = [
        { id: 1, title: "Book1" },
        { id: 2, title: "Book2" },
      ];

      //@ts-ignore
      bookRepositoryMock.getAll.mockResolvedValueOnce(fakeBooks);

      const result = await bookManager.getAllBooks();

      expect(bookRepositoryMock.getAll).toHaveBeenCalled();
      expect(result).toEqual(fakeBooks);
    });
  });

  describe("findBook", () => {
    it("should call booksRepository.getOneByProp with title", async () => {
      const fakeBook = { id: 1, title: "Book1" };
      bookRepositoryMock.getOneByProp.mockResolvedValueOnce(fakeBook);

      const result = await bookManager.findBook(fakeBook.title);

      expect(bookRepositoryMock.getOneByProp).toHaveBeenCalledWith(
        "title",
        fakeBook.title
      );
      expect(result).toEqual(fakeBook);
    });
  });

  describe("findBooksByPublisher", () => {
    it("should call booksRepository.getOneByProp with publisher_id", async () => {
      const fakeBooks = [{ id: 1, publisher_id: 42, title: "Book1" }];
      bookRepositoryMock.getOneByProp.mockResolvedValueOnce(fakeBooks);

      const result = await bookManager.findBooksByPublisher(
        fakeBooks[0].publisher_id
      );

      expect(bookRepositoryMock.getOneByProp).toHaveBeenCalledWith(
        "publisher_id",
        42
      );
      expect(result).toEqual(fakeBooks);
    });
  });

  describe("updateBook", () => {
    const existingBook = { id: 1, title: "Book1", author: "Author1" };

    it("should throw a CustomError if book is not found", async () => {
      bookRepositoryMock.getOneByProp.mockResolvedValueOnce(null);

      await expect(
        bookManager.updateBook("NonExistentBook", { author: "New Author" })
      ).rejects.toThrow(CustomError);
    });

    it("should throw a CustomError if newInfo is not an object", async () => {
      bookRepositoryMock.getOneByProp.mockResolvedValueOnce(existingBook);

      await expect(bookManager.updateBook("Book1", false)).rejects.toThrow(
        CustomError
      );
    });

    it("should throw a CustomError if BookSchema.safeParse returns error", async () => {
      bookRepositoryMock.getOneByProp.mockResolvedValueOnce(existingBook);

      (BookSchema.safeParse as jest.Mock).mockReturnValueOnce({
        error: { issues: [] },
        success: false,
      });

      await expect(
        bookManager.updateBook("Book1", { author: 123 })
      ).rejects.toThrow(CustomError);
    });

    it("should call updateById with validated data if all good", async () => {
      bookRepositoryMock.getOneByProp.mockResolvedValueOnce(existingBook);

      const updatedBook = { id: 1, title: "Book1", author: "New Author" };

      (BookSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: true,
        data: updatedBook,
      });

      await bookManager.updateBook("Book1", { author: "New Author" });

      expect(bookRepositoryMock.updateById).toHaveBeenCalledWith(
        1,
        updatedBook
      );
    });
  });

  describe("addBook", () => {
    it("should throw a CustomError if BookSchema.safeParse returns error", async () => {
      (BookSchema.safeParse as jest.Mock).mockReturnValueOnce({
        error: { issues: [] },
        success: false,
      });

      await expect(bookManager.addBook({ title: 123 }, 42)).rejects.toThrow(
        CustomError
      );
    });

    it("should insert validated book with publisher_id", async () => {
      const validBook = { title: "New Book", author: "Author" };

      (BookSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: true,
        data: validBook,
      });

      await bookManager.addBook(validBook, 42);

      expect(bookRepositoryMock.insert).toHaveBeenCalledWith({
        ...validBook,
        publisher_id: 42,
      });
    });
  });

  describe("removeBookByTitle", () => {
    it("should call deleteBookByTitle with correct title", async () => {
      await bookManager.removeBookByTitle("Book1");

      expect(bookRepositoryMock.deleteBookByTitle).toHaveBeenCalledWith(
        "Book1"
      );
    });
  });
});
