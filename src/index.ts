import Koa from "koa";
import env from "./config/env";
import { bookRouter } from "./routers/book.router";
import { userRouter } from "./routers/user.router";
import { bodyParser } from "@koa/bodyparser";
import { errorHandler } from "./middlewares/errorHandler";

const app = new Koa();

app
  .use(bodyParser())
  .use(errorHandler)
  .use(bookRouter.routes())
  .use(bookRouter.allowedMethods())
  .use(userRouter.routes())
  .use(userRouter.allowedMethods());

app.listen(env.PORT, () => {
  console.log(`Listening to port: ${env.PORT}`);
});
