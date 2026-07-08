import { NextFunction, Request, Response } from 'express';
import { isHttpError } from '../utils/httpError.js';

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (isHttpError(error)) {
    return res.status(error.statusCode).json({ message: error.message, code: error.code });
  }

  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
};
