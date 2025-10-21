import { CustomError } from "../CustomError";

export const handleMissingParam = (param: string | undefined) => {
  if (param == undefined || !param.trim()) {
    throw new CustomError("CLIENT", "Missing request parameter");
  }
};
