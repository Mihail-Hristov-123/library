import type { Context, Middleware } from "koa";

import { BookManager } from "../services/book.service.js";
import { requireAuthentication } from "./requireAuthentication.js";
import { CustomError } from "../CustomError.js";
import { handleMissingTitleParam } from "../utils/handleMissingTitleParam.js";

const bookManager = BookManager.getInstance();

export const requireAuthorization: Middleware = async (ctx: Context, next) => {
  if (!ctx.userEmail) {
    await requireAuthentication(ctx, async () => {});
  }

  const { title } = ctx.params;

  handleMissingTitleParam(title);

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
