import { configDotenv } from "dotenv";

configDotenv({ quiet: true });

const requiredEnvVariables = [
  "JWT_KEY",
  "PORT",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB",
] as const;

type Env = Record<(typeof requiredEnvVariables)[number], string>;

const env = {} as Env;

requiredEnvVariables.forEach((variable) => {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`${variable} is missing in env`);
  }
  env[variable] = value;
});

export default env;
