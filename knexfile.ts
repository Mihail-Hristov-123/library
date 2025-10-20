import * as dotenv from "dotenv";
dotenv.config({ quiet: true });
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST!,
      port: 5433,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },
};

export default config.development;
