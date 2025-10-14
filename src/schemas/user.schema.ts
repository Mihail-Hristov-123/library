import * as z from "zod";

export const UserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Username should be at least 3 characters long")
    .max(20, "Username cannot be longer than 20 characters"),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  creationDate: z.date().default(() => new Date()),
});

export type UserType = z.infer<typeof UserSchema>;
