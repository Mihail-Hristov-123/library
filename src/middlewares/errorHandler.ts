import type { Middleware } from "koa";
import { CustomError } from "../CustomError.js";

export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof CustomError) {
      ctx.status = error.statusCode;
      ctx.body = { errorType: error.type, message: error.message };
      return;
    }

    ctx.status = 500;
    ctx.body = {
      errorType: "UnknownServerError",
      message: error instanceof Error ? error.message : String(error),
    };
  }
};
