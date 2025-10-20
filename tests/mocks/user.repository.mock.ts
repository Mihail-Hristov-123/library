import { jest } from "@jest/globals";
import { baseRepositoryMockMethods } from "./base.repository.mock.js";

export const mockGetFullInfo = jest.fn();

jest.unstable_mockModule("@/repositories/user.repository.js", () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => ({
      getFullInfo: mockGetFullInfo,
      ...baseRepositoryMockMethods,
    })),
  };
});
