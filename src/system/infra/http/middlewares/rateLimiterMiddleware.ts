/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Error import
import { AppError } from '../../../errors/AppError';

// Setup
const limiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
});

const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Get translation function
  const { t } = req;

  try {
    await limiter.consume(req.ip!);

    return next();
  } catch (err) {
    throw new AppError({
      key: '@security/RATE_LIMIT',
      message: t('@security/RATE_LIMIT', 'Wait a moment.'),
      statusCode: 429,
    });
  }
};

export { rateLimiterMiddleware };
