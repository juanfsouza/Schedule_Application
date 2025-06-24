import jwt, { Secret } from 'jsonwebtoken';
import { AppError } from './error.util';

const JWT_SECRET: Secret = process.env.JWT_SECRET || '7e891cc81d7b87d2561c485d8394e364379b9319486a8bebb26a1f15bd3923be';

export const signToken = (payload: Record<string, any>, expiresIn: string = '1d'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
};