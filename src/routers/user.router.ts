import Router from "@koa/router";
import { UserManager } from "../services/user.service.js";
import { signJWT } from "../utils/signJWT.js";

import { CustomError } from "../CustomError.js";
import { setAccessTokenCookie } from "../utils/setAccessTokenCookie.js";
import { requireAuthentication } from "../middlewares/requireAuthentication.js";

import { UserBooksManager } from "../services/userBooks.service.js";
import { handleMissingParam } from "../utils/handleMissingParam.js";

export const userRouter = new Router({ prefix: "/users" });

const userManager = UserManager.getInstance();
const userBooksManager = UserBooksManager.getInstance();

userRouter.get("/:id", async (ctx) => {
  const userId = ctx.params.id;
  handleMissingParam(userId);
  const userDashboard = await userBooksManager.getUserDashboard(Number(userId));
  ctx.body = userDashboard;
});

userRouter.post("/register", async (ctx) => {
  const createdUser = await userManager.createUser(ctx.request.body);
  if (!createdUser) {
    throw new CustomError("DATABASE", "User was not created");
  }
  const { email, name } = createdUser;

  const token = signJWT(email);
  setAccessTokenCookie(ctx, token);
  ctx.status = 201;
  ctx.body = { message: `User ${name} with email ${email} was created` };
});

userRouter.post("/logout", requireAuthentication, (ctx) => {
  ctx.cookies.set("accessToken", null, {
    httpOnly: true,
    maxAge: 0,
  });
  ctx.status = 200;
  ctx.body = { message: "Logged out successfully" };
});

userRouter.post("/login", async (ctx) => {
  const credentialsValid = await userManager.checkCredentials(ctx.request.body);
  if (!credentialsValid) {
    throw new CustomError("AUTHENTICATION", "Invalid credentials");
  }
  const token = signJWT(ctx.request.body.email);
  setAccessTokenCookie(ctx, token);
  ctx.status = 201;
  ctx.body = { message: "Successfully logged in" };
});
