import { UserResponseType } from "@/schemas/user.schema";
import { getSanitizedUserInfo } from "@/utils/getSanitizedUserInfo";

const userInfo: UserResponseType = {
  email: "testEmail@gmail.com",
  password: "12345678",
  name: "Josh",
  id: 111,
  creation_date: new Date().toISOString(),
};

describe("getSanitizedUserInfo", () => {
  it("should remove the password from the provided user info object", () => {
    const result = getSanitizedUserInfo(userInfo);
    expect(result).not.toHaveProperty("password");
  });

  it("should not modify the other fields", () => {
    const userInfoWithoutPassword = { ...userInfo, password: undefined };
    expect(getSanitizedUserInfo(userInfo)).toEqual(userInfoWithoutPassword);
  });
});
