import Router from "@koa/router";

import { signJWT } from "../utils/signJWT";

import { CustomError } from "../CustomError";
import { setAccessTokenCookie } from "../utils/setAccessTokenCookie";
import { requireAuthentication } from "../middlewares/requireAuthentication";

import { handleMissingParam } from "../utils/handleMissingParam";
import { userManager } from "../services/user.service";

export const userRouter = new Router({ prefix: "/users" });

userRouter.get("/", async (ctx) => {
  ctx.body = await userManager.getAllUsers();
});

userRouter.get("/:id", async (ctx) => {
  const userId = ctx.params.id;
  handleMissingParam(userId);
  if (isNaN(Number(userId))) {
    throw new CustomError("CLIENT", "User ID parameter should be an integer");
  }

  const userDashboard = await userManager.getUserInfo(Number(userId));
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
