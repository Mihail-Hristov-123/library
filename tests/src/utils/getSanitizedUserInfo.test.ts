import type { UserResponseType } from "../../../src/schemas/user.schema.js";
import { getSanitizedUserInfo } from "../../../src/utils/getSanitizedUserInfo.js";

let mockUserInfo: UserResponseType;
let result: ReturnType<typeof getSanitizedUserInfo>;

describe("getSanitizedUserInfo", () => {
  beforeEach(() => {
    mockUserInfo = {
      id: 1,
      name: "John Doe",
      password: "12344321",
      creation_date: "Some date",
      email: "random email",
    };

    result = getSanitizedUserInfo(mockUserInfo);
  });
  it("should return a new object from the user info object with the password field removed and all other fields intact", () => {
    expect(result).not.toHaveProperty("password");
    expect(result).toEqual({
      id: 1,
      name: "John Doe",
      creation_date: "Some date",
      email: "random email",
    });
  });
  it("should not mutate the original user info object", () => {
    expect(result).not.toHaveProperty("password");
    expect(mockUserInfo.password).toBe("12344321");
  });
});
