import type { Context, Middleware } from "koa";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import isExpectedJWTPayload from "../typeGuards/isExpectedJWTPayload.js";
import { CustomError } from "../CustomError.js";
import { userManager } from "../services/user.service.js";

export const requireAuthentication: Middleware = async (ctx: Context, next) => {
  const token = ctx.cookies.get("accessToken");
  if (!token) {
    throw new CustomError("AUTHENTICATION", "Missing access token");
  }

  let payload;

  try {
    payload = jwt.verify(token, env.JWT_KEY);
  } catch (error) {
    throw new CustomError("AUTHENTICATION", "Invalid or expired access token");
  }

  if (!isExpectedJWTPayload(payload)) {
    throw new CustomError("AUTHENTICATION", "Unexpected access token type");
  }

  const userWithEmail = await userManager.findUserByEmail(payload.email);
  if (!userWithEmail) {
    throw new CustomError("AUTHENTICATION", "Invalid access token email");
  }

  ctx.userId = userWithEmail.id;
  ctx.userEmail = payload.email;

  await next();
};
