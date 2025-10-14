import Router from "@koa/router";
import { BookManager } from "../services/book.service.js";
import { getAppropriateError } from "../utils/getAppropriateError.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const bookRouter = new Router();

const bookManager = BookManager.getInstance();

bookRouter.get("/books", (ctx) => {
  ctx.body = bookManager.getAllBooks();
});

bookRouter.get("/books/:title", (ctx) => {
  const { title } = ctx.params;
  if (!title) {
    ctx.status = 400;
    ctx.body = { message: "Book title parameter is required" };
    return;
  }
  const book = bookManager.findBook(title);
  if (!book) {
    ctx.status = 404;
    ctx.body = { message: `Book ${title} was not found` };
    return;
  }
  ctx.body = book;
});

bookRouter.post("/books", requireAuth, (ctx) => {
  try {
    bookManager.addBook(ctx.request.body);
    ctx.status = 201;
    ctx.body = { message: "Book added to library" };
  } catch (error) {
    console.error("Error occurred during book addition:", error);
    ctx.status = 400;
    ctx.body = getAppropriateError(error, "Error occurred during book posting");
  }
});

bookRouter.patch("/books/:title", requireAuth, (ctx) => {
  const { title } = ctx.params;

  if (!title) {
    ctx.status = 400;
    ctx.body = { message: "Book title parameter is required" };
    return;
  }

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

bookRouter.delete(`/books/:title`, requireAuth, (ctx) => {
  const { title: bookTitle } = ctx.params;
  if (!bookTitle) {
    ctx.status = 400;
    ctx.body = { message: "Book title parameter is required" };
    return;
  }
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
