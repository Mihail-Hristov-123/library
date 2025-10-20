import { jest } from "@jest/globals";
export const mockGetOneByProp = jest.fn();
export const mockGetFullInfo = jest.fn();
export const mockInsert = jest.fn();
export const mockGetAll = jest.fn();

jest.unstable_mockModule("@/repositories/user.repository.js", () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => ({
      getOneByProp: mockGetOneByProp,
      getFullInfo: mockGetFullInfo,
      insert: mockInsert,
      getAll: mockGetAll,
    })),
  };
});
