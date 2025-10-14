import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();
const jwtKey = process.env.JWT_KEY;

export const signJWT = (email: string) => {
  try {
    if (!jwtKey) throw new Error("Invalid server setup");
    const token = jwt.sign({ email }, jwtKey, { expiresIn: "1d" });
    return token;
  } catch (error) {
    console.error(`Error occurred during JWT signing ${error}`);
    throw new Error(`Server error occurred during authentication - ${error}`);
  }
};
