const mockSign = jest.fn();

jest.mock("jsonwebtoken", () => ({
  sign: mockSign,
}));

import env from "@/config/env";
import { CustomError } from "@/CustomError";
import { signJWT } from "@/utils/signJWT";

const email = "user@abv.bg";

describe("signJWT", () => {
  it("should call jwt.sign with correct arguments and return the constructed token", () => {
    const token = "mockToken";

    mockSign.mockReturnValueOnce(token);

    const result = signJWT(email);

    expect(mockSign).toHaveBeenCalledWith({ email }, env.JWT_KEY, {
      expiresIn: "1d",
    });
    expect(result).toBe(token);
  });

  it("should throw a CustomError if jwt.sign throws an error", () => {
    mockSign.mockImplementationOnce(() => {
      throw new Error("Error: failed to sign token");
    });

    expect(() => signJWT(email)).toThrow(CustomError);
  });
});
