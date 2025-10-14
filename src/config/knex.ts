import knex from "knex";
import config from "../../knexfile.js";

if (!config.development) {
  throw new Error("Missing development config for Knex");
}

const db = knex(config.development);

export default db;
