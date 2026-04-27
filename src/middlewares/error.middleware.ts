import type { ErrorRequestHandler } from 'express';
import { HTTPError } from '../utils/errors';

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const status = err instanceof HTTPError ? err.status : 500;
  const message = err.message;

  console.error(
    `${req.path} ${req.id!} user ${req.user?.uuid ?? ''} ${status} ${message}`.trim()
  );

  return res.status(status).json({ errors: [message] });
};
