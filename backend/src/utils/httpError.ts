export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code = 'http_error',
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const isHttpError = (error: unknown): error is HttpError => error instanceof HttpError;
