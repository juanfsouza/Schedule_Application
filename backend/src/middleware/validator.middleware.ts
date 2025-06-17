import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../ultils/error.util';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new BadRequestError(result.error.errors.map((e) => e.message).join(', '));
    }
    req.body = result.data;
    next();
  };
};