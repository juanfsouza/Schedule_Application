import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../ultils/jwt.util';
import { UnauthorizedError } from '../ultils/error.util';


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  req.user = decoded as { id: string; role: string };
  next();
};