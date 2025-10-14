import { configDotenv } from "dotenv";

configDotenv();

const JWT_KEY = process.env.JWT_KEY;
const PORT = process.env.PORT || 3000;

if (!JWT_KEY) throw new Error("JWT key is missing in env file");

export const env = {
  JWT_KEY,
  PORT,
};
