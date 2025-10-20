import { jest } from "@jest/globals";

import { CustomError } from "@/CustomError.js";

import type { UserResponseType } from "@/schemas/user.schema.js";
import { mockZodError, mockZodParse } from "../../mocks/zodMocks.js";
import { mockBcryptHash } from "../../mocks/bcryptMock.js";

export const mockGetOneByProp = jest.fn();
export const mockGetFullInfo = jest.fn();
export const mockInsert = jest.fn();
const mockGetSanitizedUserInfo = jest.fn();

jest.unstable_mockModule("@/repositories/user.repository.js", () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => ({
      getOneByProp: mockGetOneByProp,
      getFullInfo: mockGetFullInfo,
      insert: mockInsert,
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
const bcrypt = await import("bcrypt");
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
    it("should return false if findUserByEmail returns a falsy value", async () => {
      mockGetOneByProp.mockReturnValueOnce(undefined);

      const result = await userManager.checkEmailTaken(email);

      expect(result).toBe(false);
    });

    it("should return true if findUserByEmail returns a truthy value", async () => {
      mockGetOneByProp.mockReturnValueOnce({ name: "randomUser" });

      const result = await userManager.checkEmailTaken(email);

      expect(result).toBe(true);
    });
  });

  describe("getUserInfo", () => {
    it("should call the user repository's getFullInfo method with the provided ID", async () => {
      mockGetFullInfo.mockReturnValueOnce(fullUserInfo);

      await userManager.getUserInfo(userId);

      expect(mockGetFullInfo).toHaveBeenCalledWith(userId);
    });

    it("should return sanitized user info if the user is found", async () => {
      mockGetFullInfo.mockReturnValueOnce(fullUserInfo);
      mockGetSanitizedUserInfo.mockReturnValueOnce(sanitizedUserInfo);

      const result = await userManager.getUserInfo(userId);

      expect(getSanitizedUserInfo).toHaveBeenCalledWith(fullUserInfo);
      expect(result).toEqual(sanitizedUserInfo);
    });

    it("should throw a CustomError if the user was not found", async () => {
      mockGetFullInfo.mockReturnValueOnce(undefined);

      await expect(userManager.getUserInfo(userId)).rejects.toThrow(
        CustomError
      );
    });
  });

  describe("createUser", () => {
    it("should call the user repository's insert method with the provided user info and the hashed password if no errors are thrown, and return the user", async () => {
      mockGetOneByProp.mockImplementationOnce(() => false);
      mockZodParse.mockImplementationOnce(() => ({
        data: fullUserInfo,
        success: true,
      }));

      const hashedPass = "sadasdsasdlnckjasbcubsa";
      mockBcryptHash.mockImplementationOnce(() => hashedPass);

      const mockCreatedUser = { ...fullUserInfo, password: hashedPass };
      mockInsert.mockImplementationOnce(() => [mockCreatedUser]);

      const result = await userManager.createUser(fullUserInfo);

      expect(mockInsert).toHaveBeenCalledWith({
        email: fullUserInfo.email,
        name: fullUserInfo.name,
        password: hashedPass,
      });

      expect(result).toBe(mockCreatedUser);
    });

    it("should throw a CustomError if the provided user info does not pass zod validation", async () => {
      mockZodParse.mockReturnValueOnce({
        error: mockZodError,
        success: false,
      });

      await expect(userManager.createUser(fullUserInfo)).rejects.toThrow(
        CustomError
      );
    });

    it("should throw a CustomError if the email is already taken", async () => {
      mockZodParse.mockImplementationOnce(() => ({
        data: fullUserInfo,
        success: true,
      }));

      mockGetOneByProp.mockImplementationOnce(() => true); // A user with that email was found

      await expect(userManager.createUser(fullUserInfo)).rejects.toThrow(
        CustomError
      );
    });

    it("should throw a CustomError if bcrypt throws an error during password hashing", async () => {
      mockZodParse.mockImplementationOnce(() => ({
        data: fullUserInfo,
        success: true,
      }));

      mockGetOneByProp.mockImplementationOnce(() => false);

      mockBcryptHash.mockImplementationOnce(() => {
        throw new Error("Failed to hash password");
      });

      await expect(userManager.createUser(fullUserInfo)).rejects.toThrow(
        CustomError
      );
    });
  });
});
