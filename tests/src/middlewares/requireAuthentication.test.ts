import { jest } from "@jest/globals";

import type { Context, Next } from "koa";
import type { UserResponseType } from "@/schemas/user.schema.js";
import { CustomError } from "@/CustomError.js";
import { mockJwtVerify } from "../../mocks/jsonwebtoken.mock.js";
import { mockIsExpectedJWTPayload } from "../../mocks/isExpectedJWTPayload.mock.js";
import { mockGetOneByProp } from "../../mocks/base.repository.mock.js";

const { requireAuthentication } = await import(
  "@/middlewares/requireAuthentication.js"
);

describe("requireAuthentication", () => {
  let next: Next;

  const createCtx = (token: string | undefined): Context =>
    ({
      cookies: { get: jest.fn().mockReturnValue(token) },
      userId: undefined,
      userEmail: undefined,
    } as unknown as Context);

  beforeEach(() => {
    next = jest.fn() as unknown as Next;
    jest.clearAllMocks();
  });

  it("should throw a CustomError if the access token is missing", async () => {
    const ctx = createCtx(undefined);
    await expect(requireAuthentication(ctx, next)).rejects.toThrow(CustomError);
  });

  it("should throw a CustomError if the access token is invalid", async () => {
    const ctx = createCtx("invalidToken");
    mockJwtVerify.mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });

    await expect(requireAuthentication(ctx, next)).rejects.toThrow(CustomError);
  });

  it("should throw a CustomError if JWT payload format is invalid", async () => {
    const ctx = createCtx("mockToken");
    mockJwtVerify.mockReturnValueOnce({ invalid: "payload" });
    mockIsExpectedJWTPayload.mockReturnValueOnce(false);

    await expect(requireAuthentication(ctx, next)).rejects.toThrow(CustomError);
  });

  it("should throw a CustomError if no user is found for the email in the access token", async () => {
    const ctx = createCtx("mockToken");
    mockJwtVerify.mockReturnValueOnce({ email: "not@found.com" });
    mockIsExpectedJWTPayload.mockReturnValueOnce(true);
    mockGetOneByProp.mockReturnValueOnce(undefined);

    await expect(requireAuthentication(ctx, next)).rejects.toThrow(CustomError);
  });

  it("should set userId and userEmail in the context and call next", async () => {
    const ctx = createCtx("validToken");
    const validUser: Partial<UserResponseType> = {
      id: 42,
      email: "test@example.com",
    };

    mockJwtVerify.mockReturnValueOnce({ email: validUser.email });
    mockIsExpectedJWTPayload.mockReturnValueOnce(true);
    mockGetOneByProp.mockReturnValueOnce(validUser);

    await requireAuthentication(ctx, next);

    expect(ctx.userId).toBe(validUser.id);
    expect(ctx.userEmail).toBe(validUser.email);
    expect(next).toHaveBeenCalled();
  });
});
