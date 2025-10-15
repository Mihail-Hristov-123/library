import Router from "@koa/router";
import { BookManager } from "../services/book.service.js";
import { getAppropriateError } from "../utils/getAppropriateError.js";
import { requireAuthentication } from "../middlewares/requireAuthentication.js";
import { requireAuthorization } from "../middlewares/requireAuthorization.js";
import type { Context } from "koa";

export const bookRouter = new Router({ prefix: "/books" });

const bookManager = BookManager.getInstance();

bookRouter.get("/", async (ctx) => {
  ctx.body = await bookManager.getAllBooks();
});

bookRouter.get("/:title", async (ctx) => {
  const { title } = ctx.params;
  if (!title) {
    ctx.status = 400;
    ctx.body = { message: "Book title parameter is required" };
    return;
  }
  const book = await bookManager.findBook(title);
  if (!book) {
    ctx.status = 404;
    ctx.body = { message: `Book ${title} was not found` };
    return;
  }
  ctx.body = book;
});

bookRouter.post("/", requireAuthentication, (ctx) => {
  try {
    bookManager.addBook({ ...ctx.request.body }, ctx.userId);
    ctx.status = 201;
    ctx.body = { message: "Book added to library" };
  } catch (error) {
    console.error("Error occurred during book addition:", error);
    ctx.status = 400;
    ctx.body = getAppropriateError(error, "Error occurred during book posting");
  }
});

bookRouter.patch("/:title", requireAuthorization, (ctx) => {
  const title = ctx.bookTitle;

  try {
    bookManager.updateBook(title, ctx.request.body);
    ctx.status = 200;
    ctx.body = { message: `${title} successfully updated` };
  } catch (error) {
    console.error(`An error occurred during book update:`, error);
    ctx.status = 400;
    ctx.body = getAppropriateError(
      error,
      "An error occurred during book update"
    );
  }
});

bookRouter.delete(`/:title`, requireAuthorization, (ctx) => {
  const { bookTitle } = ctx;
  try {
    bookManager.removeBookByTitle(bookTitle);
    ctx.status = 200;
    ctx.body = { message: `${bookTitle} deleted successfully` };
  } catch (error) {
    console.error(`An error occurred during book deletion: ${error}`);
    ctx.status = 404;
    ctx.body = getAppropriateError(error, "Error occurred during book removal");
  }
});
