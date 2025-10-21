import jwt from "jsonwebtoken";
import env from "@/config/env";
import isExpectedJWTPayload from "@/typeGuards/isExpectedJWTPayload";
import { userManager } from "@/services/user.service";
import { CustomError } from "@/CustomError";
import { requireAuthentication } from "@/middlewares/requireAuthentication";

jest.mock("jsonwebtoken");
jest.mock("@/typeGuards/isExpectedJWTPayload");
jest.mock("@/services/user.service");

describe("requireAuthentication middleware", () => {
  let ctx: any;
  let next: jest.Mock;

  beforeEach(() => {
    ctx = {
      cookies: {
        get: jest.fn(),
      },
      userId: undefined,
      userEmail: undefined,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("throws if no token cookie", async () => {
    ctx.cookies.get.mockReturnValue(undefined);

    await expect(requireAuthentication(ctx, next)).rejects.toThrow(CustomError);
    expect(ctx.cookies.get).toHaveBeenCalledWith("accessToken");
    expect(next).not.toHaveBeenCalled();
  });

  it("throws if jwt.verify throws", async () => {
    ctx.cookies.get.mockReturnValue("token");
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(requireAuthentication(ctx, next)).rejects.toThrow(CustomError);
    expect(jwt.verify).toHaveBeenCalledWith("token", env.JWT_KEY);
    expect(next).not.toHaveBeenCalled();
  });

  it("throws if payload fails isExpectedJWTPayload", async () => {
    ctx.cookies.get.mockReturnValue("token");
    (jwt.verify as jest.Mock).mockReturnValue({ foo: "bar" });
    (isExpectedJWTPayload as unknown as jest.Mock).mockReturnValue(false);

    await expect(requireAuthentication(ctx, next)).rejects.toThrow(CustomError);
    expect(isExpectedJWTPayload).toHaveBeenCalledWith({ foo: "bar" });
    expect(next).not.toHaveBeenCalled();
  });

  it("throws if user not found for payload email", async () => {
    ctx.cookies.get.mockReturnValue("token");
    const payload = { email: "user@example.com" };
    (jwt.verify as jest.Mock).mockReturnValue(payload);
    (isExpectedJWTPayload as unknown as jest.Mock).mockReturnValue(true);
    (userManager.findUserByEmail as jest.Mock).mockResolvedValue(null);

    await expect(requireAuthentication(ctx, next)).rejects.toThrow(CustomError);
    expect(userManager.findUserByEmail).toHaveBeenCalledWith(payload.email);
    expect(next).not.toHaveBeenCalled();
  });

  it("sets ctx userId and userEmail and calls next on success", async () => {
    ctx.cookies.get.mockReturnValue("token");
    const payload = { email: "user@example.com" };
    const user = { id: 123, email: "user@example.com" };

    (jwt.verify as jest.Mock).mockReturnValue(payload);
    (isExpectedJWTPayload as unknown as jest.Mock).mockReturnValue(true);
    (userManager.findUserByEmail as jest.Mock).mockResolvedValue(user);

    await requireAuthentication(ctx, next);

    expect(ctx.userId).toBe(user.id);
    expect(ctx.userEmail).toBe(payload.email);
    expect(next).toHaveBeenCalled();
  });
});
