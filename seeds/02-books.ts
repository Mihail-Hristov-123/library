import knex from "knex";

export async function seed(knex: knex.Knex): Promise<void> {
  await knex("books").del();

  await knex("books").insert([
    {
      title: "The Art of Possibility",
      author: "Rosamund Zander",
      publicationYear: 2000,
      description:
        "An inspiring book about transforming personal and professional life through creativity.",
      publisher_id: 1,
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      publicationYear: 2018,
      description:
        "A comprehensive guide on building good habits and breaking bad ones using proven strategies.",
      publisher_id: 2,
    },
    {
      title: "Clean Code",
      author: "Robert Martin",
      publicationYear: 2008,
      description:
        "A must-read book for developers on writing readable, maintainable, and efficient code.",
      publisher_id: 3,
    },
    {
      title: "Sapiens",
      author: "Yuval Harari",
      publicationYear: 2011,
      description:
        "A groundbreaking narrative exploring the history and impact of Homo sapiens on the world.",
      publisher_id: 1,
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      publicationYear: 2016,
      description:
        "A guide to focused success in a distracted world, emphasizing deep, uninterrupted work.",
      publisher_id: 2,
    },
  ]);
}
