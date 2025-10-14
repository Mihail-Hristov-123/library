import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("books", (table) => {
    table.increments("id").primary();

    table
      .string("title")
      .notNullable()
      .unique()
      .checkLength(">=", 2)
      .checkLength("<=", 100);

    table
      .string("author")
      .notNullable()
      .checkLength(">=", 3)
      .checkLength("<=", 30);

    table
      .integer("publicationYear")
      .notNullable()
      .checkBetween([1450, new Date().getFullYear()]);

    table
      .text("description")
      .notNullable()
      .checkLength(">=", 20)
      .checkLength("<=", 200);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("books");
}
