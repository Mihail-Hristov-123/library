import "koa";

declare module "koa" {
  interface Context {
    userEmail?: string;
    bookTitle?: string;
  }
}
