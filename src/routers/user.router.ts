import Router from "@koa/router";
import { User } from "../services/user.service.js";

export const userRouter = new Router();

const users = User.getInstance();

userRouter.get("/users", (ctx) => {
  ctx.body = users.getUsers();
});
