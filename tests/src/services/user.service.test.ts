import { jest } from "@jest/globals";

import { CustomError } from "@/CustomError.js";
import type { UserResponseType } from "@/schemas/user.schema.js";

export const mockGetOneByProp = jest.fn();
export const mockGetFullInfo = jest.fn();
const mockGetSanitizedUserInfo = jest.fn();
jest.unstable_mockModule("@/repositories/user.repository.js", () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => ({
      getOneByProp: mockGetOneByProp,
      getFullInfo: mockGetFullInfo,
    })),
  };
});

jest.unstable_mockModule("@/utils/getSanitizedUserInfo.js", () => ({
  getSanitizedUserInfo: mockGetSanitizedUserInfo,
}));

const { userManager } = await import("@/services/user.service.js");
const { getSanitizedUserInfo } = await import(
  "@/utils/getSanitizedUserInfo.js"
);

const email = "randomEmail@gmail.com";
const userId = 1;
const fullUserInfo: UserResponseType = {
  creation_date: new Date().toDateString(),
  email,
  id: userId,
  password: "secretPass",
  name: "John Doe",
};
const sanitizedUserInfo = { ...fullUserInfo, password: undefined };

describe("UserManager", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("findUserByEmail", () => {
    it("should call the user repository's getOneByProp method with the provided email", () => {
      userManager.findUserByEmail(email);
      expect(mockGetOneByProp).toHaveBeenCalledWith("email", email);
    });
  });

  describe("checkEmailTaken", () => {
    it("should return false if the UserManager's findUserByEmail returns a falsy value", async () => {
      mockGetOneByProp.mockReturnValueOnce(undefined);
      const result = await userManager.checkEmailTaken(email);
      expect(result).toBe(false);
    });

    it("should return true if the UserManager's findUserByEmail returns a truthy value", async () => {
      mockGetOneByProp.mockReturnValueOnce({ name: "randomUser" });
      const result = await userManager.checkEmailTaken(email);
      expect(result).toBe(true);
    });
  });

  describe("getUserInfo", () => {
    it("should call the UserRepository's getFullInfo method with the provided ID", async () => {
      mockGetFullInfo.mockImplementationOnce(() => fullUserInfo);
      await userManager.getUserInfo(userId);
      expect(mockGetFullInfo).toHaveBeenCalledWith(userId);
    });

    it("should return sanitized user info if the user is found", async () => {
      mockGetFullInfo.mockImplementationOnce(() => fullUserInfo);
      mockGetSanitizedUserInfo.mockImplementationOnce(() => sanitizedUserInfo);
      const result = await userManager.getUserInfo(userId);

      expect(getSanitizedUserInfo).toHaveBeenCalledWith(fullUserInfo);
      expect(result).toEqual(sanitizedUserInfo);
    });

    it("should throw a CustomError if the user was not found", async () => {
      mockGetFullInfo.mockImplementationOnce(() => undefined);

      await expect(() => userManager.getUserInfo(userId)).rejects.toThrow(
        CustomError
      );
    });
  });
});
