/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import util from 'util';
import Youch from 'youch';

// Error import
import { AppError } from '../../../errors/AppError';

const errorMiddleware = async (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
): Promise<Response<any> | void> => {
  // Get translation function
  const { t } = req;

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  // App error
  if (err instanceof AppError) {
    if (err.key && err.message)
      return res.status(err.statusCode).json({
        code: err.key,
        message: err.message,
        ...(err.debug && {
          fatal: true,
        }),
      });
    return res.status(err.statusCode).send();
  }

  // Get errors
  const errors = await new Youch(err, req).toJSON();

  // Check if is a JSON error
  if (String(errors.error?.message).includes('JSON at position'))
    return res.status(400).json({
      code: '@general/JSON_ERROR',
      message: t(
        '@general/JSON_ERROR',
        'Your request has problems on the JSON structure.',
      ),
    });

  // Log to server
  console.log(
    `❌ Application failure: `,
    util.inspect(errors, false, null, true),
  );

  // Console debug
  if (process.env.NODE_ENV !== 'production') {
    // Return 500
    return res.status(500).json(errors);
  }

  // Return 500
  return res.status(500).json({
    code: '@general/INTERNAL_SERVER_ERROR',
    message: t('@general/INTERNAL_SERVER_ERROR', 'Internal server error.'),
    fatal: true,
  });
};

export { errorMiddleware };
