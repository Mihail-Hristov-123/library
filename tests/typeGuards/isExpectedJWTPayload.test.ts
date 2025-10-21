import isExpectedJWTPayload from "@/typeGuards/isExpectedJWTPayload";

describe("isExpectedJWTPayload", () => {
  it("should return true for an object with string email property", () => {
    const payload = { email: "user@example.com" };
    expect(isExpectedJWTPayload(payload)).toBe(true);
  });

  it("should return false if the payload is null", () => {
    expect(isExpectedJWTPayload(null)).toBe(false);
  });

  it("should return false if the payload is not an object", () => {
    expect(isExpectedJWTPayload(123)).toBe(false);
    expect(isExpectedJWTPayload("string")).toBe(false);
    expect(isExpectedJWTPayload(true)).toBe(false);
  });

  it("should return false if the payload has no email property", () => {
    expect(isExpectedJWTPayload({})).toBe(false);
    expect(isExpectedJWTPayload({ name: "John" })).toBe(false);
  });

  it("should return false if the email property is not a string", () => {
    expect(isExpectedJWTPayload({ email: 123 })).toBe(false);
    expect(isExpectedJWTPayload({ email: null })).toBe(false);
    expect(isExpectedJWTPayload({ email: {} })).toBe(false);
  });
});
