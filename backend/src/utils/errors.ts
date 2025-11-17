/**
 * Custom error class for application-specific errors
 */
export class CustomError extends Error {
  statusCode: number;
  errors?: Record<string, string>;

  constructor(message: string, statusCode: number, errors?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    // Set the prototype explicitly to ensure proper inheritance
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  /**
   * Serialize errors for the response
   */
  serializeErrors(): Array<{ message: string; field?: string }> {
    if (this.errors) {
      return Object.entries(this.errors).map(([field, message]) => ({
        message,
        field,
      }));
    }

    return [{ message: this.message }];
  }
}

/**
 * 400 Bad Request Error
 */
export class BadRequestError extends CustomError {
  constructor(message = 'Bad Request', errors?: Record<string, string>) {
    super(message, 400, errors);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends CustomError {
  constructor(message = 'Not Found') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends CustomError {
  constructor(message = 'Conflict') {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * 422 Unprocessable Entity Error
 */
export class ValidationError extends CustomError {
  constructor(errors: Record<string, string>) {
    super('Validation failed', 422, errors);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends CustomError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
