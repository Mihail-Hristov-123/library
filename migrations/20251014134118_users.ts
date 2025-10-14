import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();

    table
      .string("name")
      .notNullable()
      .checkLength(">=", 3)
      .checkLength("<=", 20);

    table.string("email").notNullable().unique();

    table.string("password").notNullable().checkLength(">=", 8);

    table.dateTime("creation_date").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
