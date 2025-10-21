import { CustomError } from "@/CustomError";
import { handleMissingParam } from "@/utils/handleMissingParam";
import { bookManager } from "@/services/book.service";
import { requireAuthentication } from "@/middlewares/requireAuthentication";
import { requireAuthorization } from "@/middlewares/requireAuthorization";

jest.mock("@/utils/handleMissingParam");
jest.mock("@/services/book.service");
jest.mock("@/middlewares/requireAuthentication");

describe("requireAuthorization middleware", () => {
  let ctx: any;
  let next: jest.Mock;

  beforeEach(() => {
    ctx = {
      params: {},
      userEmail: undefined,
      userId: 42,
      bookTitle: undefined,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("calls requireAuthentication if ctx.userEmail is missing", async () => {
    ctx.userEmail = undefined;
    ctx.params = { title: "Some Book" };
    ctx.userId = 1;

    (handleMissingParam as jest.Mock).mockImplementation(() => {});
    (requireAuthentication as jest.Mock).mockResolvedValue(undefined);
    (bookManager.findBook as jest.Mock).mockResolvedValue({
      title: "Some Book",
      publisher_id: 1,
    });

    await requireAuthorization(ctx, next);

    expect(requireAuthentication).toHaveBeenCalledWith(
      ctx,
      expect.any(Function)
    );
    expect(next).toHaveBeenCalled();
  });

  it("throws if title param is missing", async () => {
    ctx.userEmail = "user@example.com";
    ctx.params = { title: undefined };

    (handleMissingParam as jest.Mock).mockImplementation(() => {
      throw new CustomError("CLIENT", "Missing request parameter");
    });

    await expect(requireAuthorization(ctx, next)).rejects.toThrow(CustomError);

    expect(handleMissingParam).toHaveBeenCalledWith(undefined);
    expect(next).not.toHaveBeenCalled();
  });

  it("throws if book not found", async () => {
    ctx.userEmail = "user@example.com";
    ctx.params = { title: "My Book" };
    (handleMissingParam as jest.Mock).mockImplementation(() => {});
    (bookManager.findBook as jest.Mock).mockResolvedValue(null);

    await expect(requireAuthorization(ctx, next)).rejects.toThrow(CustomError);
    expect(bookManager.findBook).toHaveBeenCalledWith("My Book");
  });

  it("throws if book publisher_id does not match userId", async () => {
    ctx.userEmail = "user@example.com";
    ctx.userId = 1;
    ctx.params = { title: "My Book" };

    (handleMissingParam as jest.Mock).mockImplementation(() => {});
    (bookManager.findBook as jest.Mock).mockResolvedValue({
      publisher_id: 2,
      title: "My Book",
    });

    await expect(requireAuthorization(ctx, next)).rejects.toThrow(CustomError);
  });

  it("sets ctx.bookTitle and calls next if authorized", async () => {
    ctx.userEmail = "user@example.com";
    ctx.userId = 1;
    ctx.params = { title: "My Book" };

    (handleMissingParam as jest.Mock).mockImplementation(() => {});
    (bookManager.findBook as jest.Mock).mockResolvedValue({
      publisher_id: 1,
      title: "My Book",
    });

    await requireAuthorization(ctx, next);

    expect(ctx.bookTitle).toBe("My Book");
    expect(next).toHaveBeenCalled();
  });
});
