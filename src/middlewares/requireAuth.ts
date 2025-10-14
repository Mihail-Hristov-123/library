import type { Context, Middleware } from "koa";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserManager } from "../services/user.service.js";

const userManager = UserManager.getInstance();

const isJwtPayloadWithEmail = (
  payload: unknown
): payload is { email: string } => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "email" in payload &&
    typeof payload.email === "string"
  );
};

export const requireAuth: Middleware = async (ctx: Context, next) => {
  const token = ctx.cookies.get("accessToken");
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: "This action requires authentication" };
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_KEY);
    if (
      !isJwtPayloadWithEmail(payload) ||
      !userManager.checkUserExistence(payload.email)
    ) {
      throw new Error("Invalid or incomplete access token");
    }

    ctx.userEmail = payload.email;
    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    ctx.status = 401;
    ctx.body = { message: "This action requires authentication" };
  }
};
