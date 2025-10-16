import Koa from "koa";
import env from "./config/env.js";
import { bookRouter } from "./routers/book.router.js";
import { userRouter } from "./routers/user.router.js";
import { bodyParser } from "@koa/bodyparser";
import { errorHandler } from "./middlewares/errorHandler.js";

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
