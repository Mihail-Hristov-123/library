import { jest } from "@jest/globals";
export const mockIsExpectedJWTPayload = jest.fn();

jest.unstable_mockModule("@/typeGuards/isExpectedJWTPayload.js", () => ({
  default: mockIsExpectedJWTPayload,
}));
