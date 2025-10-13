import Koa from "koa";
import { configDotenv } from "dotenv";
import { bookRouter } from "./routers/book.router.js";
import { userRouter } from "./routers/user.router.js";
import { bodyParser } from "@koa/bodyparser";

configDotenv();
const app = new Koa();
const PORT = process.env.PORT || 3000;

app
  .use(bodyParser())
  .use(bookRouter.routes())
  .use(bookRouter.allowedMethods())
  .use(userRouter.routes())
  .use(userRouter.allowedMethods());

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
