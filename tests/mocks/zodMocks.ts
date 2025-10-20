import { ZodError } from "zod";
import { jest } from "@jest/globals";
export const mockZodError = new ZodError([
  {
    code: "invalid_type",
    expected: "string",

    path: ["email"],
    message: "Expected string, received number",
  },
  {
    code: "too_small",
    minimum: 3,
    inclusive: true,
    origin: "string",
    path: ["name"],
    message: "String must contain at least 3 character(s)",
  },
]);

export const mockZodParse = jest.fn();

jest.unstable_mockModule("@/schemas/user.schema.js", () => ({
  UserSchema: {
    safeParse: mockZodParse,
  },
  BookSchema: {
    safeParse: mockZodParse,
  },
}));
