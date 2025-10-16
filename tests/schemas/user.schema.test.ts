import { UserSchema, type UserType } from "../../src/schemas/user.schema.js";

const validUser: UserType = {
  email: "realEmail@gmail.com",
  password: "12345678",
  name: "Josh",
};

describe("UserSchema", () => {
  it("should pass validation with valid data", () => {
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("should not pass validation with missing fields", () => {
    const result = UserSchema.safeParse({
      email: validUser.email,
      password: validUser.password,
    });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should not pass validation with invalid name length", () => {
    expect(UserSchema.safeParse({ ...validUser, name: "Aa" }).success).toBe(
      false
    );

    expect(
      UserSchema.safeParse({
        ...validUser,
        name: "Aaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }).success
    ).toBe(false);
  });

  it("should trim name before validation", () => {
    const result = UserSchema.safeParse({
      ...validUser,
      name: "              Josh    ",
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.name).toBe("Josh");
  });
});
