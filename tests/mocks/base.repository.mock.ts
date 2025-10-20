import { jest } from "@jest/globals";
export const mockDeleteBookByTitle = jest.fn();
export const mockGetAll = jest.fn();
export const mockGetOneByProp = jest.fn();
export const mockInsert = jest.fn();
export const mockUpdateById = jest.fn();

export const baseRepositoryMockMethods = {
  getAll: mockGetAll,
  getOneByProp: mockGetOneByProp,
  insert: mockInsert,
  updateById: mockUpdateById,
};

jest.unstable_mockModule("@/repositories/base.repository.js", () => {
  return {
    BaseRepository: jest
      .fn()
      .mockImplementation(() => baseRepositoryMockMethods),
  };
});
