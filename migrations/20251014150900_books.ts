import type { Knex } from "knex";

const currentYear = new Date().getFullYear();

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
      .checkBetween([1450, currentYear]);

    table
      .text("description")
      .notNullable()
      .checkLength(">=", 20)
      .checkLength("<=", 200);

    table
      .integer("publisher_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("books");
}
