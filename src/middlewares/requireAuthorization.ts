import type { Context, Middleware } from "koa";

import { requireAuthentication } from "./requireAuthentication";
import { CustomError } from "../CustomError";
import { handleMissingParam } from "../utils/handleMissingParam";
import { bookManager } from "../services/book.service";

export const requireAuthorization: Middleware = async (ctx: Context, next) => {
  if (!ctx.userEmail) {
    await requireAuthentication(ctx, async () => {});
  }

  const { title } = ctx.params;

  handleMissingParam(title);

  const book = await bookManager.findBook(title);

  if (!book) {
    throw new CustomError("NOT_FOUND", `Book ${title} was not found`);
  }

  if (book.publisher_id !== ctx.userId) {
    throw new CustomError(
      "AUTHORIZATION",
      "A book can only be modified by its owner"
    );
  }

  ctx.bookTitle = title;

  await next();
};
