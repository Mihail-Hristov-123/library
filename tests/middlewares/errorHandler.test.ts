import { CustomError } from "@/CustomError";
import { errorHandler } from "@/middlewares/errorHandler";

describe("errorHandler middleware", () => {
  let ctx: any;
  let next: jest.Mock;

  beforeEach(() => {
    ctx = {
      status: 0,
      body: null,
    };
    next = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call next and do nothing if no error is thrown", async () => {
    next.mockResolvedValueOnce(undefined);

    await errorHandler(ctx, next);

    expect(next).toHaveBeenCalled();
    expect(ctx.status).toBe(0);
    expect(ctx.body).toBeNull();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("should handle CustomError and set ctx status and body accordingly", async () => {
    const customError = new CustomError("CLIENT", "Invalid input");

    next.mockRejectedValueOnce(customError);

    await errorHandler(ctx, next);

    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({
      errorType: customError.type,
      message: customError.message,
    });
    expect(console.error).toHaveBeenCalledWith(
      "Error caught in middleware:",
      customError
    );
  });

  it("should handle AggregateError and log each error", async () => {
    const error1 = new Error("First error");
    const error2 = new Error("Second error");
    const aggError = new AggregateError([error1, error2], "Multiple errors");

    next.mockRejectedValueOnce(aggError);

    await errorHandler(ctx, next);

    expect(console.error).toHaveBeenCalledWith(
      "Multiple errors caught in middleware:"
    );
    expect(console.error).toHaveBeenCalledWith(error1);
    expect(console.error).toHaveBeenCalledWith(error2);
    expect(ctx.status).toBe(500);
    expect(ctx.body).toEqual({ error: "Unknown Server Error" });
  });

  it("should handle unknown errors and respond with 500", async () => {
    const unknownError = new Error("Unexpected failure");

    next.mockRejectedValueOnce(unknownError);

    await errorHandler(ctx, next);

    expect(console.error).toHaveBeenCalledWith(
      "Error caught in middleware:",
      unknownError
    );
    expect(ctx.status).toBe(500);
    expect(ctx.body).toEqual({ error: "Unknown Server Error" });
  });
});
