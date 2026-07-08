import { NextFunction, Request, Response } from 'express';
import { AuthUser } from '../domain/types.js';
import { authService, extractBearerToken } from '../services/auth.service.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    req.user = await authService.resolveProfile(token);
    return next();
  } catch (error) {
    return next(error);
  }
};
