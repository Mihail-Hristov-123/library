import knex from "knex";
import devConfig from "../../knexfile";

export abstract class BaseRepository<T> {
  protected abstract tableName: "users" | "books";

  protected static db = knex(devConfig);

  protected get db() {
    return BaseRepository.db;
  }

  getAll() {
    return this.db<T[]>(this.tableName).select();
  }

  getOneById(id: number) {
    return this.db(this.tableName).select().where({ id }).first();
  }

  getOneByProp<K extends keyof T>(prop: K, value: T[K]) {
    if (prop === "password") {
      console.error(
        "Cannot find a user by password due to security considerations"
      );
      return;
    }
    return this.db(this.tableName)
      .select()
      .where({ [prop]: value })
      .first();
  }

  deleteById(id: number) {
    return this.db(this.tableName).delete().where({ id });
  }

  insert(data: Partial<T>) {
    return this.db(this.tableName).insert(data).returning("*");
  }

  updateById(id: number, data: Partial<T>) {
    return this.db(this.tableName).update(data).where({ id });
  }
}
