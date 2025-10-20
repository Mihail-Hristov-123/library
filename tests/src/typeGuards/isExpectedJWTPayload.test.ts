import isExpectedJWTPayload from "@/typeGuards/isExpectedJWTPayload.js";

const validPayload = {
  email: "realEmail@gmail.com",
};

describe("isExpectedJWTPayload", () => {
  it("should return true if an object with an email field of type string is passed", () => {
    expect(isExpectedJWTPayload(validPayload)).toBe(true);
  });

  describe("invalid inputs", () => {
    it("should return false if null is passed", () => {
      expect(isExpectedJWTPayload(null)).toBe(false);
    });

    it("should return false if an object without email property is passed", () => {
      expect(isExpectedJWTPayload({ username: "testUser" })).toBe(false);
      expect(isExpectedJWTPayload([1, 2, 3])).toBe(false);
    });

    it("should return false if the type of the email property is not a string", () => {
      expect(isExpectedJWTPayload({ email: 123 })).toBe(false);
      expect(isExpectedJWTPayload({ email: true })).toBe(false);
    });

    it("should return false if a primitive is passed", () => {
      expect(isExpectedJWTPayload("string")).toBe(false);
      expect(isExpectedJWTPayload(undefined)).toBe(false);
    });
  });
});
