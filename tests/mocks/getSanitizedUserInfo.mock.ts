import { jest } from "@jest/globals";

export const mockGetSanitizedUserInfo = jest.fn();
jest.unstable_mockModule("@/utils/getSanitizedUserInfo.js", () => ({
  getSanitizedUserInfo: mockGetSanitizedUserInfo,
}));
