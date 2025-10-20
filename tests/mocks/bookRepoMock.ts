import { jest } from "@jest/globals";
export const mockDeleteBookByTitle = jest.fn();
export const mockGetAll = jest.fn();
export const mockGetOneByProp = jest.fn();
export const mockInsert = jest.fn();
export const mockUpdateById = jest.fn();

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
