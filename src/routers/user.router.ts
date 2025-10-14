import Router from "@koa/router";
import { UserManager } from "../services/user.service.js";
import { getAppropriateError } from "../utils/getAppropriateError.js";
import { signJWT } from "../utils/signJWT.js";

import { CustomError } from "../CustomError.js";
import { setAccessTokenCookie } from "../utils/setAccessTokenCookie.js";
import { requireAuthentication } from "../middlewares/requireAuthentication.js";

export const userRouter = new Router();

const userManager = UserManager.getInstance();

userRouter.post("/users/register", async (ctx) => {
  try {
    const { name, email } = await userManager.createUser(ctx.request.body);
    const token = signJWT(email);
    setAccessTokenCookie(ctx, token);
    ctx.status = 201;
    ctx.body = { message: `User ${name} with email ${email} was created` };
  } catch (error) {
    console.error(`Error occurred during registration: ${error}`);
    ctx.status = error instanceof CustomError ? error.statusCode : 500;
    ctx.body = getAppropriateError(error, "Error occurred during registration");
  }
});

userRouter.post("/users/logout", requireAuthentication, (ctx) => {
  ctx.cookies.set("accessToken", null, {
    httpOnly: true,
    maxAge: 0,
  });
  ctx.status = 200;
  ctx.body = { message: "Logged out successfully" };
});

userRouter.post("/users/login", async (ctx) => {
  try {
    const credentialsValid = await userManager.checkCredentials(
      ctx.request.body
    );
    if (!credentialsValid) {
      ctx.status = 401;
      ctx.body = { message: "Invalid credentials" };
      return;
    }
    const token = signJWT(ctx.request.body.email);
    setAccessTokenCookie(ctx, token);
    ctx.status = 201;
    ctx.body = { message: "Successfully logged in" };
  } catch (error) {
    console.error(`Error occurred during login: ${error}`);
    ctx.status = error instanceof CustomError ? error.statusCode : 500;
    ctx.body = getAppropriateError(error, "Login failed");
  }
});
