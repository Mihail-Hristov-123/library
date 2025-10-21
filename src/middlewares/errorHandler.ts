import type { Middleware } from "koa";
import { CustomError } from "../CustomError";

export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error("Multiple errors caught in middleware:");
      error.errors.forEach((err) => console.error(err));
    } else {
      console.error("Error caught in middleware:", error);
    }

    if (error instanceof CustomError) {
      ctx.status = error.statusCode;
      ctx.body = { errorType: error.type, message: error.message };
      return;
    }

    ctx.status = 500;
    ctx.body = {
      error: "Unknown Server Error",
    };
  }
};
