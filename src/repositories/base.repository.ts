import db from "../config/knex.js";

export abstract class BaseRepository<T> {
  protected abstract tableName: "users" | "books";

  getAll() {
    return db<T[]>(this.tableName).select();
  }

  getOneById(id: number) {
    return db(this.tableName).select().where({ id }).first();
  }

  getOneByProp<K extends keyof T>(prop: K, value: T[K]) {
    if (prop === "password") {
      console.error(
        "Cannot find a user by password due to security considerations"
      );
      return;
    }
    return db(this.tableName)
      .select()
      .where({ [prop]: value })
      .first();
  }

  deleteById(id: number) {
    return db(this.tableName).delete().where({ id });
  }

  insert(data: Partial<T>) {
    return db(this.tableName).insert(data).returning("*");
  }

  updateById(id: number, data: Partial<T>) {
    return db(this.tableName).update(data).where({ id });
  }
}
