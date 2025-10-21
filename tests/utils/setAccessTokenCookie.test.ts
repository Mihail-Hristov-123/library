import { setAccessTokenCookie } from "@/utils/setAccessTokenCookie";
import type { Context } from "koa";

describe("setAccessTokenCookie", () => {
  it("sets the accessToken cookie with correct options", () => {
    const mockSet = jest.fn();
    const ctx = {
      cookies: {
        set: mockSet,
      },
    } as unknown as Context;

    const token = "test-token";

    setAccessTokenCookie(ctx, token);

    expect(mockSet).toHaveBeenCalledWith("accessToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
  });
});
