import Router from "@koa/router";
import { BookManager } from "../services/book.service.js";
import { requireAuthentication } from "../middlewares/requireAuthentication.js";
import { requireAuthorization } from "../middlewares/requireAuthorization.js";
import { CustomError } from "../CustomError.js";
import { handleMissingParam } from "../utils/handleMissingParam.js";

export const bookRouter = new Router({ prefix: "/books" });

const bookManager = BookManager.getInstance();

bookRouter.get("/", async (ctx) => {
  ctx.body = await bookManager.getAllBooks();
});

bookRouter.get("/:title", async (ctx) => {
  const { title } = ctx.params;

  handleMissingParam(title);

  const book = await bookManager.findBook(title!); // is non-null assertion OK here? The util above throws if title is undefined

  if (!book) {
    throw new CustomError("NOT_FOUND", `Book ${title} was not found`);
  }
  ctx.body = book;
});

bookRouter.post("/", requireAuthentication, async (ctx) => {
  await bookManager.addBook({ ...ctx.request.body }, ctx.userId);
  ctx.status = 201;
  ctx.body = { message: "Book added to library" };
});

bookRouter.patch("/:title", requireAuthorization, async (ctx) => {
  const title = ctx.bookTitle;
  await bookManager.updateBook(title, ctx.request.body);
  ctx.status = 200;
  ctx.body = { message: `${title} successfully updated` };
});

bookRouter.delete(`/:title`, requireAuthorization, async (ctx) => {
  const { bookTitle } = ctx;
  await bookManager.removeBookByTitle(bookTitle);
  ctx.status = 200;
  ctx.body = { message: `${bookTitle} deleted successfully` };
});
