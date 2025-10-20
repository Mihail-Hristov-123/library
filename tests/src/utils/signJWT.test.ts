import { jest } from "@jest/globals";

const mockSign = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: mockSign,
  },
}));

const { signJWT } = await import("../../../src/utils/signJWT.js");
const { CustomError } = await import("../../../src/CustomError.js");

describe("signJWT (ESM test)", () => {
  const email = "test@example.com";

  beforeEach(() => {
    mockSign.mockReset();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it("should return a token when jwt.sign succeeds", () => {
    const fakeToken = "mocked_token";
    mockSign.mockReturnValueOnce(fakeToken);

    const token = signJWT(email);
    expect(token).toBe(fakeToken);
  });

  it("should throw a CustomError when jwt.sign throws", () => {
    mockSign.mockImplementationOnce(() => {
      throw new Error("Token signing failed");
    });

    expect(() => signJWT(email)).toThrow(CustomError);
  });
});
