import type { Context } from "koa";

export const setAccessTokenCookie = (ctx: Context, token: string) => {
  ctx.cookies.set("accessToken", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });
};
