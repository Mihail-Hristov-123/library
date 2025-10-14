import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signJWT = (email: string) => {
  try {
    const token = jwt.sign({ email }, env.JWT_KEY, { expiresIn: "1d" });
    return token;
  } catch (error) {
    console.error(`Error occurred during JWT signing ${error}`);
    throw new Error(`Server error occurred during authentication - ${error}`);
  }
};
