import { jest } from "@jest/globals";

export const mockGetOneByProp = jest.fn();

jest.unstable_mockModule("../../../src/repositories/user.repository.js", () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => ({
      getOneByProp: mockGetOneByProp,
    })),
  };
});

const { userManager } = await import("../../../src/services/user.service.js");

describe("UserManager", () => {
  const email = "randomEmail@gmail.com";

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
});
