import * as z from "zod";
import { LoginSchema } from "./login.schema";

export const UserSchema = LoginSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, "Username should be at least 3 characters long")
    .max(20, "Username cannot be longer than 20 characters"),
});

export type UserType = z.infer<typeof UserSchema>;

export type UserResponseType = UserType & { id: number; creation_date: string };
