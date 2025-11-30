export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

export class HTTPError extends AppError {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = 500;
  }
}

export class HTTPUnauthorizedError extends HTTPError {
  constructor(message?: string) {
    super(message || "Unauthorized");
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

export class HTTPForbiddenError extends HTTPError {
  constructor(message?: string) {
    super(message || "Forbidden");
    this.name = "ForbiddenError";
    this.status = 403;
  }
}

export class HTTPInternalServerError extends HTTPError {
  constructor(message?: string) {
    super(message || "Internal Server Error");
    this.name = "InternalServerError";
    this.status = 500;
  }
}
