import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): asserts req is Request & { user: User } {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    throw new Error('Unauthorized');
  }

  // Example: decode token
  const user: User = {
    id: '123',
    email: 'test@example.com',
    role: 'admin',
  };

  req.user = user;
  next();
}

