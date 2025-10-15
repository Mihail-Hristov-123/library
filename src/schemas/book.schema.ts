import * as z from "zod";

export const BookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),

  author: z
    .string()
    .trim()
    .min(3, "Author name must be at least 3 character")
    .max(30, "Author name cannot exceed 30 characters"),

  publicationYear: z.coerce
    .number()
    .min(1450, "Publication year must be 1450 or later")
    .max(new Date().getFullYear(), `Publication year cannot be in the future`),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(200, "Description cannot exceed 200 characters"),
});

export type BookType = z.infer<typeof BookSchema>;
export type BookResponseType = BookType & { publisher_id: number };
