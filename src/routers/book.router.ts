import Router from "@koa/router";
import { Book } from "../services/book.service.js";

export const bookRouter = new Router();

const books = Book.getInstance();

bookRouter.get("/books", (ctx) => {
  ctx.body = books.displayBooks();
});
