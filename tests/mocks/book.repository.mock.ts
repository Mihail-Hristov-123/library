import { jest } from "@jest/globals";
import { baseRepositoryMockMethods } from "./base.repository.mock.js";
export const mockDeleteBookByTitle = jest.fn();
jest.unstable_mockModule("@/repositories/book.repository.js", () => {
  return {
    BookRepository: jest.fn().mockImplementation(() => ({
      deleteBookByTitle: mockDeleteBookByTitle,
      ...baseRepositoryMockMethods,
    })),
  };
});
