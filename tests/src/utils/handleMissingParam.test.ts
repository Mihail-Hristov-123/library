import { CustomError } from "../../../src/CustomError.js";
import { handleMissingParam } from "../../../src/utils/handleMissingParam.js";

describe("handleMissingParam", () => {
  it("should throw when param is undefined", () => {
    expect(() => handleMissingParam(undefined)).toThrow(CustomError);
  });
  it("should throw when param is an empty string", () => {
    expect(() => handleMissingParam("")).toThrow(CustomError);
  });
  it("should throw when param is a blank string", () => {
    expect(() => handleMissingParam("  ")).toThrow(CustomError);
  });

  it("should not throw when param is valid - non empty string", () => {
    expect(() => handleMissingParam("1")).not.toThrow();
  });
});
