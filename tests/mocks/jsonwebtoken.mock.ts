import { jest } from "@jest/globals";
export const mockJwtVerify = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { verify: mockJwtVerify },
}));
