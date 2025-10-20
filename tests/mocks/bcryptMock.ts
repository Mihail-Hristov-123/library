import { jest } from "@jest/globals";

export const mockBcryptHash = jest.fn();

jest.unstable_mockModule("bcrypt", () => {
  return {
    hash: mockBcryptHash,
  };
});
