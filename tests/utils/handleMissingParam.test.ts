import { CustomError } from "@/CustomError";
import { handleMissingParam } from "@/utils/handleMissingParam";

describe("handleMissingParam", () => {
  it("should throw a CustomError if the param is undefined", () => {
    expect(() => handleMissingParam(undefined)).toThrow(CustomError);
  });

  it("should throw a CustomError if the trimmed param is an empty string", () => {
    expect(() => handleMissingParam("")).toThrow(CustomError);
    expect(() => handleMissingParam("  ")).toThrow(CustomError);
  });

  it("should not throw if param is a valid non-empty string", () => {
    expect(() => handleMissingParam("validBookTitle")).not.toThrow();

    expect(() => handleMissingParam("1")).not.toThrow();
  });
});
