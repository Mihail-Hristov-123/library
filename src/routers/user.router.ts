import Router from "@koa/router";
import { UserManager } from "../services/user.service.js";
import { getAppropriateError } from "../utils/setAppropriateError.js";
import { signJWT } from "../utils/signJWT.js";

import { CustomError } from "../CustomError.js";

export const userRouter = new Router();

const userManager = UserManager.getInstance();

userRouter.post("/users/register", async (ctx) => {
  try {
    const { name, email } = await userManager.createUser(ctx.request.body);

    const token = signJWT(name, email);

    ctx.cookies.set("accessToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    ctx.status = 201;
    ctx.body = { message: `User ${name} with email ${email} was created` };
  } catch (error) {
    console.error(error);
    ctx.status = error instanceof CustomError ? error.statusCode : 500;
    ctx.body = getAppropriateError(error, "Error occurred during registration");
  }
});

userRouter.post("/users/logout", (ctx) => {
  ctx.cookies.set("accessToken", null, {
    httpOnly: true,
    maxAge: 0,
  });
  ctx.status = 200;
  ctx.body = { message: "Logged out successfully" };
});
