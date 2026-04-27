import prisma from '@src/lib/prisma';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyIdToken } from '../lib/firebase';
import { HTTPUnauthorizedError } from '../utils/errors';



function getBearerToken(authorization: string | undefined): string | null {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }
  const token = authorization.slice('Bearer '.length).trim();
  return token || null;
}

export const requireFirebaseAuth: RequestHandler = async (req, _res, next) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    next(new HTTPUnauthorizedError('Missing or invalid Authorization header'));
    return;
  }

  try {
    req.firebaseUser = await verifyIdToken(token);
    next();
  } catch {
    next(new HTTPUnauthorizedError('Invalid or expired token'));
  }
};

export const requireUser: RequestHandler = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const token =
    req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice('Bearer '.length).trim()
      : '';
  if (!token) {
    next(new HTTPUnauthorizedError());
    return;
  }

  try {
    const firebaseUser = await verifyIdToken(token);
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: firebaseUser.email,
      },
    });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
