import { CustomError } from "../CustomError.js";

export const handleMissingTitleParam = (title: string | undefined) => {
  if (!title || !title.trim()) {
    throw new CustomError(
      "CLIENT",
      "Book title is required in the request parameters"
    );
  }
};
