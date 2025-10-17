import { jest } from "@jest/globals";
import type { BookType } from "../../src/schemas/book.schema.js";
import { CustomError } from "../../src/CustomError.js";

const mockDeleteBookByTitle = jest.fn();
const mockGetAll = jest.fn();
const mockGetOneByProp = jest.fn();
const mockInsert = jest.fn();
const mockUpdateById = jest.fn();

jest.unstable_mockModule("../../src/repositories/book.repository.js", () => {
  return {
    BookRepository: jest.fn().mockImplementation(() => ({
      getAll: mockGetAll,
      deleteBookByTitle: mockDeleteBookByTitle,
      getOneByProp: mockGetOneByProp,
      insert: mockInsert,
      updateById: mockUpdateById,
    })),
  };
});

const { bookManager } = await import("../../src/services/book.service.js");

const validBook: BookType = {
  author: "Unknown",
  description: "A book about the story of a successful bus driver",
  publicationYear: 2023,
  title: "The bus driver",
};

describe("BookManager", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getAllBooks", () => {
    it("should call the book repository's getAll method", () => {
      bookManager.getAllBooks();
      expect(mockGetAll).toHaveBeenCalled();
    });
  });

  describe("findBookByTitle", () => {
    it('should call the getOneByProp method of the book repository with "title" and the provided title as arguments', () => {
      const bookTitle = "It II";
      bookManager.findBook(bookTitle);

      expect(mockGetOneByProp).toHaveBeenCalledWith("title", bookTitle);
    });
  });

  describe("findBookByPublisher", () => {
    it('should call the getOneByProp method of the book repository with "publisher_id" and the provided user id as arguments', () => {
      const userId = 12;
      bookManager.findBooksByPublisher(userId);

      expect(mockGetOneByProp).toHaveBeenCalledWith("publisher_id", userId);
    });
  });

  describe("updateBook", () => {
    it("should throw a CustomError if the provided book is not found", async () => {
      mockGetOneByProp.mockResolvedValueOnce(null as unknown as never); // probably bad

      await expect(() =>
        bookManager.updateBook("non-existent book", {})
      ).rejects.toThrow(CustomError);
    });

    it("should throw a CustomError if the type of the provided new book info is not an object", async () => {
      mockGetOneByProp.mockResolvedValueOnce(true as unknown as never);

      await expect(() =>
        bookManager.updateBook("Existing book", "title = Silence of the lambs")
      ).rejects.toThrow(CustomError);
    });

    it("should throw a CustomError if the constructed new book info does not pass zod validation", async () => {
      mockGetOneByProp.mockResolvedValueOnce({
        title: "some book",
      } as unknown as never);

      await expect(() =>
        bookManager.updateBook("Existing book", {})
      ).rejects.toThrow(CustomError);
    });

    it("should call the book repo's updateById method with the id of the book and the new constructed data", async () => {
      mockGetOneByProp.mockResolvedValueOnce({
        ...validBook,
        id: 1,
      } as unknown as never);

      await expect(() =>
        bookManager.updateBook(validBook.title, { title: "Train driver story" })
      ).resolves.not.toThrow();

      expect(mockUpdateById).toHaveBeenCalledWith(1, {
        ...validBook,
        title: "Train driver story",
      });
    });
  });

  describe("addBook", () => {
    const userId = 1;

    it("should call book repository's insert method with the parsed result's data and the user ID if zod validation is passed", async () => {
      await bookManager.addBook(validBook, userId);
      expect(mockInsert).toHaveBeenCalledWith({
        ...validBook,
        publisher_id: userId,
      });
    });

    it("should throw a CustomError if the book doesn't pass zod validation", async () => {
      await expect(() =>
        bookManager.addBook({ ...validBook, description: "short" }, 1)
      ).rejects.toThrow(CustomError);
    });
  });

  describe("removeBookByTitle", () => {
    it("should call the book repository with the provided title", () => {
      const bookTitle = "1984";
      bookManager.removeBookByTitle(bookTitle);
      expect(mockDeleteBookByTitle).toHaveBeenCalledWith(bookTitle);
    });
  });
});
