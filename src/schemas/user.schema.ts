import * as z from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(3).max(20),
  password: z.string().min(8),
  creationDate: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
