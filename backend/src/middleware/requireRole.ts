import { NextFunction, Request, Response } from 'express';
import { AppRole } from '../domain/types.js';

export const requireRole =
  (...roles: AppRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    return next();
  };
