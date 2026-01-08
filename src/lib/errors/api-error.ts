/**
 * API Error Classes
 * Provides typed error handling for API responses
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public path?: string,
    public method?: string,
    public errors?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromResponse(response: {
    statusCode: number;
    message: string;
    path?: string;
    method?: string;
    errors?: Record<string, unknown>;
  }): ApiError {
    return new ApiError(
      response.message,
      response.statusCode,
      response.path,
      response.method,
      response.errors,
    );
  }

  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }

  isValidationError(): boolean {
    return this.statusCode === 400 && !!this.errors;
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
