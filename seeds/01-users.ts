import knex from "knex";
import bcrypt from "bcrypt";

const getHashedPass = (password: string) => bcrypt.hashSync(password, 10);

export async function seed(knex: knex.Knex): Promise<void> {
  await knex("users").del();

  await knex("users").insert([
    {
      name: "John",
      email: "john@gmail.com",
      password: getHashedPass("password123"),
    },
    {
      name: "Bob",
      email: "bob@yahoo.com",
      password: getHashedPass("123454321"),
    },
    {
      name: "Charlie",
      email: "charlie@email.com",
      password: getHashedPass("charlie"),
    },
  ]);
}
