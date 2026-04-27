import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { User } from '@prisma/client';
import prisma from '../lib/prisma';
import { verifyIdToken } from '../lib/firebase';
import { HTTPError, HTTPUnauthorizedError } from '../errors';

export const setRequestId: RequestHandler = (req, _, next) => {
  req.id = (req.headers?.['x-request-id'] as string) || crypto.randomUUID();
  next();
};

export const requireUser: RequestHandler = (
  req: Request,
  _: Response,
  next: NextFunction
): asserts req is Request & { user: User } => {
  const token = req.headers.authorization?.split('Bearer ')[0] || '';
  if (!token) {
    throw new HTTPUnauthorizedError();
  }

  verifyIdToken(token)
    .then((firebaseUser) =>
      prisma.user.findUniqueOrThrow({
        where: {
          email: firebaseUser.email,
        }
      }))
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const status = err instanceof HTTPError ? err.status : 500;
  const message = err.message;

  console.error(
    `${req.path} ${req.id!} user ${req.user?.uuid ?? ''} ${status} ${message}`.trim()
  );

  return res.status(status).json({ errors: [message] });
};
