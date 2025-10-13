import Router from "@koa/router";
import { Book } from "../services/book.service.js";

export const bookRouter = new Router();

const books = Book.getInstance();

bookRouter.get("/books", (ctx) => {
  ctx.body = books.displayBooks();
});

bookRouter.post("/books", (ctx) => {
  try {
    books.addBook(ctx.request.body);
    ctx.status = 201;
    ctx.body = { message: "Book added to library" };
  } catch (error) {
    console.error("Error occurred during book addition:", error);
    ctx.status = 400;
    ctx.body = { message: error };
  }
});

bookRouter.patch("/books/:title", (ctx) => {
  const { title } = ctx.params;

  if (!title) {
    ctx.status = 400;
    ctx.body = { message: "Book title parameter is required" };
    return;
  }

  try {
    books.updateBook(title, ctx.request.body);
    ctx.status = 201;
    ctx.body = { message: `${title} successfully updated` };
  } catch (error) {
    console.error(`An error occurred during book update:`, error);
    ctx.status = 400;
    ctx.body = { message: error };
  }
});

bookRouter.delete(`/books/:title`, (ctx) => {
  const { title: bookTitle } = ctx.params;
  if (!bookTitle) {
    ctx.status = 400;
    ctx.body = { message: "Book title parameter is required" };
    return;
  }
  try {
    books.removeBookByTitle(bookTitle);
    ctx.status = 400;
    ctx.body = { message: `${bookTitle} deleted successfully` };
  } catch (error) {
    console.error(`An error occurred during book deletion: ${error}`);
    ctx.status = 404;
    ctx.body = {
      message:
        error instanceof Error
          ? error.message
          : "An unknown error occurred during book removal",
    };
  }
});
