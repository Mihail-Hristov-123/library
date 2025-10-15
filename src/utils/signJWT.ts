import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { CustomError } from "../CustomError.js";

export const signJWT = (email: string) => {
  try {
    const token = jwt.sign({ email }, env.JWT_KEY, { expiresIn: "1d" });
    return token;
  } catch (error) {
    throw new CustomError("SERVER", "Failed to issue an access token");
  }
};
