import * as z from "zod";
import { LoginSchema } from "./login.schema.js";

export const UserSchema = LoginSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, "Username should be at least 3 characters long")
    .max(20, "Username cannot be longer than 20 characters"),
  creationDate: z.date().default(() => new Date()),
});

export type UserType = z.infer<typeof UserSchema>;
