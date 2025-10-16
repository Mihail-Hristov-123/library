export enum ErrorStatus {
  "VALIDATION" = 400,
  "CONFLICT" = 409,
  "AUTHENTICATION" = 401,
  "AUTHORIZATION" = 403,
  "SERVER" = 500,
  "CLIENT" = 400,
  "NOT_FOUND" = 404,
  "DATABASE" = 500,
}

type ErrorType = keyof typeof ErrorStatus;

export class CustomError extends Error {
  statusCode: number;
  type: ErrorType;
  constructor(type: ErrorType, message: string) {
    super(message);
    this.type = type;
    this.statusCode = ErrorStatus[type];
  }
}
