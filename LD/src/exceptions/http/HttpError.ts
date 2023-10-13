import { IError } from '@interfaces/error.interface';
import { HttpErrorParams } from '@interfaces/httpErrorParams.interface';

export class HttpError extends Error {
  errors: IError;
  status: number;

  /**
   * Creates an API error instance.
   * @param {string} message - The error message, defaults to: 'API Error'.
   * @param {Object} errors - Error object and/or additional data.
   * @param {number} status - The HTTP status code, defaults to: '500'.
   * @param {string} stack - Error stack.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(params: HttpErrorParams = {}) {
    const { message = 'Internal server error', errors, stack, status = 500 } = params;
    super(message);
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.stack = stack;
    Error.captureStackTrace(this, this.constructor);
  }
}
