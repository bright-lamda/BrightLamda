import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({ message: 'Validation failed', issues: result.error.issues });
    }

    req.body = result.data;
    return next();
  };
