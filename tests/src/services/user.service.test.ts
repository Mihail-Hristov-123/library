import { jest } from "@jest/globals";

import { CustomError } from "@/CustomError.js";

import type { UserResponseType } from "@/schemas/user.schema.js";
import { mockZodError, mockZodParse } from "../../mocks/zod.schemas.mock.js";
import { mockBcryptCompare, mockBcryptHash } from "../../mocks/bcrypt.mock.js";
import type { LoginType } from "@/schemas/login.schema.js";
import { mockGetSanitizedUserInfo } from "../../mocks/getSanitizedUserInfo.mock.js";
import {
  mockGetAll,
  mockGetOneByProp,
  mockInsert,
} from "../../mocks/base.repository.mock.js";
import { mockGetFullInfo } from "../../mocks/user.repository.mock.js";

const { userManager } = await import("@/services/user.service.js");

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
    it("should call the user repository's getOneByProp method with the provided email and return the result", async () => {
      mockGetOneByProp.mockReturnValueOnce({
        name: "Josh",
        email: "randomemail@gmail.com",
      });
      const result = await userManager.findUserByEmail(email);
      expect(mockGetOneByProp).toHaveBeenCalledWith("email", email);
      expect(result).toEqual({ name: "Josh", email: "randomemail@gmail.com" });
    });
  });

  describe("getAllUsers", () => {
    it("should call the user repository's getAll method and return the result", async () => {
      const mockResult = [{ name: "userOne" }, { name: "userTwo" }];
      mockGetAll.mockReturnValueOnce(mockResult);
      const result = await userManager.getAllUsers();
      expect(mockGetAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("checkEmailTaken", () => {
    it("should return false if a user with the given email is not found", async () => {
      mockGetOneByProp.mockReturnValueOnce(undefined);

      const result = await userManager.checkEmailTaken(email);

      expect(result).toBe(false);
    });

    it("should return true if a user with the given email is found", async () => {
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

      expect(mockGetSanitizedUserInfo).toHaveBeenCalledWith(fullUserInfo);
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
    it("should call the user repository's insert method with the provided user info and the hashed password if no errors are thrown and finally return the user", async () => {
      mockGetOneByProp.mockReturnValueOnce(undefined);
      mockZodParse.mockReturnValueOnce({
        data: fullUserInfo,
        success: true,
      });

      const hashedPass = "sadasdsasdlnckjasbcubsa";
      mockBcryptHash.mockReturnValueOnce(hashedPass);

      const mockCreatedUser = { ...fullUserInfo, password: hashedPass };
      mockInsert.mockReturnValueOnce([mockCreatedUser]);

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
      mockZodParse.mockReturnValueOnce({
        data: fullUserInfo,
        success: true,
      });

      mockGetOneByProp.mockReturnValueOnce(true); // A user with that email was found

      await expect(userManager.createUser(fullUserInfo)).rejects.toThrow(
        CustomError
      );
    });

    it("should throw a CustomError if bcrypt throws an error during password hashing", async () => {
      mockZodParse.mockReturnValueOnce({
        data: fullUserInfo,
        success: true,
      });

      mockGetOneByProp.mockReturnValueOnce(undefined);

      mockBcryptHash.mockImplementationOnce(() => {
        throw new Error("Failed to hash password");
      });

      await expect(userManager.createUser(fullUserInfo)).rejects.toThrow(
        CustomError
      );
    });
  });
  describe("checkCredentials", () => {
    const validLoginCredentials: LoginType = {
      email: "realmeial@gmail.com",
      password: "1234432123",
    };

    it("should return true when email exists and the password matches", async () => {
      mockZodParse.mockReturnValueOnce({
        success: true,
        data: validLoginCredentials,
      });

      mockGetOneByProp.mockReturnValueOnce(fullUserInfo);
      mockBcryptCompare.mockReturnValueOnce(true);

      const result = await userManager.checkCredentials(validLoginCredentials);
      expect(result).toBe(true);
    });

    it("should return false when email exists but the password does not match", async () => {
      mockZodParse.mockReturnValueOnce({
        success: true,
        data: validLoginCredentials,
      });

      mockGetOneByProp.mockReturnValueOnce(fullUserInfo);
      mockBcryptCompare.mockReturnValueOnce(false);

      const result = await userManager.checkCredentials(validLoginCredentials);
      expect(result).toBe(false);
    });

    it("should throw a CustomError if zod validation of the login credentials is unsuccessful", async () => {
      mockZodParse.mockReturnValueOnce({
        success: false,
        error: mockZodError,
      });

      await expect(() =>
        userManager.checkCredentials(validLoginCredentials)
      ).rejects.toThrow(CustomError);
    });

    it("should throw a CustomError if an account with the provided email is not found", async () => {
      mockZodParse.mockReturnValueOnce({
        success: true,
        data: validLoginCredentials,
      });
      mockGetOneByProp.mockReturnValueOnce(undefined);

      await expect(() =>
        userManager.checkCredentials(validLoginCredentials)
      ).rejects.toThrow(CustomError);
    });

    it("should throw a CustomError if bcrypt compare throws an error", async () => {
      mockZodParse.mockReturnValueOnce({
        success: true,
        data: validLoginCredentials,
      });
      mockGetOneByProp.mockReturnValueOnce(fullUserInfo);
      mockBcryptCompare.mockImplementationOnce(() => {
        throw new Error("Password comparison error");
      });
      await expect(() =>
        userManager.checkCredentials(validLoginCredentials)
      ).rejects.toThrow(CustomError);
    });
  });
});
