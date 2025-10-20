import {
  LoginSchema,
  type LoginType,
} from "../../../src/schemas/login.schema.js";

const validLoginCredentials: LoginType = {
  email: "realEmail@gmail.com",
  password: "12345678",
};

describe("LoginSchema", () => {
  it("should pass validation with valid data", () => {
    expect(LoginSchema.safeParse(validLoginCredentials).success).toBe(true);
  });

  it("should fail if the password is too short and report it", () => {
    const result = LoginSchema.safeParse({
      ...validLoginCredentials,
      password: "1234567",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    if (result.error) {
      expect(result.error.message).toBeDefined();
    }
  });

  it("should fail if the email is invalid", () => {
    expect(
      LoginSchema.safeParse({
        ...validLoginCredentials,
        email: "unrealEmail@gmail.c",
      }).success
    ).toBe(false);
  });
});
