import type { UserResponseType } from "../schemas/user.schema";

export const getSanitizedUserInfo = (
  info: UserResponseType
): Partial<UserResponseType> => {
  const { password, ...sanitized } = info;
  return sanitized;
};
