import { BookSchema, type BookType } from "@/schemas/book.schema.js";

const validBook: BookType = {
  title: "1984",
  author: "George Orwell",
  description: "A popular novel about...",
  publicationYear: 1967,
};

describe("BookSchema", () => {
  it("should pass validation with valid data", () => {
    const result = BookSchema.safeParse(validBook);
    expect(result.success).toBe(true);
  });

  it("should fail if one field or more are missing", () => {
    const result = BookSchema.safeParse({ author: "George Orwell" });
    expect(result.success).toBe(false);
  });

  it("should fail if one field or more fields are invalid", () => {
    const resultOne = BookSchema.safeParse({
      ...validBook,
      publicationYear: "string",
    });

    const resultTwo = BookSchema.safeParse({ ...validBook, title: "A" });

    expect(resultOne.success).toBe(false);
    expect(resultTwo.success).toBe(false);
  });

  it("should trim strings before validation", () => {
    const result = BookSchema.safeParse({
      ...validBook,
      description: "   A popular novel about...   ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe(validBook.description);
    }
  });
});
