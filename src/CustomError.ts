enum ErrorStatus {
  "VALIDATION" = 400,
  "CONFLICT" = 409,
  "AUTHENTICATION" = 401,
  "AUTHORIZATION" = 403,
  "SERVER" = 500,
  "CLIENT" = 400,
  "NOT_FOUND" = 404,
}

export class CustomError extends Error {
  statusCode: number;
  constructor(type: keyof typeof ErrorStatus, message: string) {
    super(message);
    this.statusCode = ErrorStatus[type];
  }
}
