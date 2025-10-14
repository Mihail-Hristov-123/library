enum ErrorStatus {
  "VALIDATION" = 400,
  "CONFLICT" = 409,
  "AUTHENTICATION" = 401,
  "SERVER" = 500,
}

export class CustomError extends Error {
  statusCode: number;
  constructor(type: keyof typeof ErrorStatus, message: string) {
    super(message);
    this.statusCode = ErrorStatus[type];
  }
}
