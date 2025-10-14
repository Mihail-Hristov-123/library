import z from "zod";

export const LoginSchema = z.object({
  email: z.email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginType = z.infer<typeof LoginSchema>;
