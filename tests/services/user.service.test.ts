import { UserRepository } from "@/repositories/user.repository";
import { CustomError } from "@/CustomError";
import * as bcrypt from "bcrypt";

import { getSanitizedUserInfo } from "@/utils/getSanitizedUserInfo";
import { UserManager } from "@/services/user.service";

import { UserSchema } from "@/schemas/user.schema";
import { LoginSchema } from "@/schemas/login.schema";

jest.mock("@/repositories/user.repository");
jest.mock("bcrypt");
jest.mock("@/utils/getSanitizedUserInfo");

const mockUserRepo = UserRepository as jest.MockedClass<typeof UserRepository>;
const mockHash = bcrypt.hash as jest.Mock;
const mockCompare = bcrypt.compare as jest.Mock;
const mockGetSanitized = getSanitizedUserInfo as jest.Mock;

describe("UserManager", () => {
  let userManager: UserManager;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // @ts-ignore
    userRepositoryMock = new mockUserRepo();
    userManager = new UserManager();

    // @ts-ignore - because I override a private property
    userManager.userRepository = userRepositoryMock;

    jest.clearAllMocks();

    jest.spyOn(UserSchema, "safeParse");
    jest.spyOn(LoginSchema, "safeParse");
  });

  describe("createUser", () => {
    it("should throw a CustomError if user info validation fails", async () => {
      (UserSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: false,
        error: { issues: [] },
      });

      await expect(
        userManager.createUser({
          email: "invalid",
          name: "John",
          password: "pass123",
        })
      ).rejects.toThrow(CustomError);

      expect(UserSchema.safeParse).toHaveBeenCalled();
    });

    it("should throw a CustomError if email is already used", async () => {
      (UserSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: true,
        data: {
          email: "test@test.com",
          name: "John",
          password: "pass123",
        },
      });

      userRepositoryMock.getOneByProp.mockResolvedValueOnce({
        id: 1,
        email: "test@test.com",
      });

      await expect(
        userManager.createUser({
          email: "test@test.com",
          name: "John",
          password: "pass123",
        })
      ).rejects.toThrow(CustomError);

      expect(userRepositoryMock.getOneByProp).toHaveBeenCalledWith(
        "email",
        "test@test.com"
      );
    });

    it("should create a new user", async () => {
      (UserSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: true,
        data: {
          email: "test@test.com",
          name: "John",
          password: "pass123",
        },
      });

      userRepositoryMock.getOneByProp.mockResolvedValueOnce(undefined); // A user with that email wasn't found
      mockHash.mockResolvedValueOnce("hashedPass");
      userRepositoryMock.insert.mockResolvedValueOnce([
        { id: 1, email: "test@test.com", name: "John" },
      ]);

      const result = await userManager.createUser({
        email: "test@test.com",
        name: "John",
        password: "pass123",
      });

      expect(result).toEqual({ id: 1, email: "test@test.com", name: "John" });
      expect(mockHash).toHaveBeenCalledWith("pass123", 10);
      expect(userRepositoryMock.insert).toHaveBeenCalled();
    });
  });

  describe("checkCredentials", () => {
    it("should throw if login data validation fails", async () => {
      (LoginSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: false,
        error: { issues: [] },
      });

      await expect(
        userManager.checkCredentials({
          email: "test@test.com",
          password: "pass123",
        })
      ).rejects.toThrow(CustomError);

      expect(LoginSchema.safeParse).toHaveBeenCalled();
    });

    it("should return true if credentials are correct", async () => {
      (LoginSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: true,
        data: {
          email: "test@test.com",
          password: "pass123",
        },
      });

      userRepositoryMock.getOneByProp.mockResolvedValueOnce({
        password: "hashed",
      });
      mockCompare.mockResolvedValueOnce(true);

      const result = await userManager.checkCredentials({
        email: "test@test.com",
        password: "pass123",
      });

      expect(result).toBe(true);
    });

    it("should throw if account does not exist", async () => {
      (LoginSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: true,
        data: {
          email: "wrong@test.com",
          password: "123",
        },
      });

      userRepositoryMock.getOneByProp.mockResolvedValueOnce(null);

      await expect(
        userManager.checkCredentials({
          email: "wrong@test.com",
          password: "123",
        })
      ).rejects.toThrow(CustomError);
    });
  });

  describe("getUserInfo", () => {
    it("should return sanitized user info", async () => {
      const fakeUser = { id: 1, email: "test@test.com", password: "secret" };
      userRepositoryMock.getFullInfo.mockResolvedValueOnce(fakeUser);
      mockGetSanitized.mockReturnValueOnce({ id: 1, email: "test@test.com" });

      const result = await userManager.getUserInfo(1);

      expect(result).toEqual({ id: 1, email: "test@test.com" });
      expect(mockGetSanitized).toHaveBeenCalledWith(fakeUser);
    });

    it("should throw if user is not found", async () => {
      userRepositoryMock.getFullInfo.mockResolvedValueOnce(null);

      await expect(userManager.getUserInfo(999)).rejects.toThrow(CustomError);
    });
  });
});
