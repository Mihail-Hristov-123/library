import type { Context, Middleware } from "koa";

import { BookManager } from "../services/book.service.js";
import { requireAuthentication } from "./requireAuthentication.js";

const bookManager = BookManager.getInstance();

export const requireAuthorization: Middleware = async (ctx: Context, next) => {
  if (!ctx.userEmail) {
    await requireAuthentication(ctx, async () => {});
    if (ctx.status === 401) {
      return;
    }
  }

  const { title } = ctx.params;
  if (!title) {
    ctx.status = 400;
    ctx.body = { message: "Book title parameter is required" };
    return;
  }

  const book = bookManager.findBook(title);

  if (!book) {
    ctx.status = 404;
    ctx.body = { message: "Book was not found" };
    return;
  }

  if (book.publisher !== ctx.userEmail) {
    ctx.status = 403;
    ctx.body = { message: "A book can only be modified by its publisher" };
    return;
  }

  ctx.bookTitle = title;

  await next();
};
