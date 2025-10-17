import type { Context } from "koa";
import { setAccessTokenCookie } from "../../src/utils/setAccessTokenCookie.js";

const mockSet = jest.fn();
const ctx = {
  cookies: {
    set: mockSet,
  },
} as unknown as Context;

describe("setAccessTokenCookie", () => {
  it("should call ctx.cookies.set with the correct options", () => {
    const token = "test-token";

    setAccessTokenCookie(ctx, token);

    expect(mockSet).toHaveBeenCalledWith("accessToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
  });
});
