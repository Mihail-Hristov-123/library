import type { Context, Middleware } from "koa";

import { BookManager } from "../services/book.service.js";
import { requireAuthentication } from "./requireAuthentication.js";
import { CustomError } from "../CustomError.js";

const bookManager = BookManager.getInstance();

export const requireAuthorization: Middleware = async (ctx: Context, next) => {
  if (!ctx.userEmail) {
    await requireAuthentication(ctx, async () => {});
  }

  const { title } = ctx.params;
  if (!title) {
    throw new CustomError(
      "CLIENT",
      "Book title is required in the request parameters"
    );
  }

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
