import { NextFunction, Request, Response } from 'express';
import { ObjectShape } from 'yup/lib/object';
import * as Yup from 'yup';

// i18n import
import { TFunction } from '@system/i18n';

// Error import
import { AppError } from '@system/errors/AppError';

const Segments = {
  BODY: 'body',
  COOKIES: 'cookies',
  HEADERS: 'headers',
  PARAMS: 'params',
  QUERY: 'query',
  SIGNEDCOOKIES: 'signedCookies',
} as const;

const validateSchema = (params: {
  value: any;
  t: TFunction;
  schema: ObjectShape;
}) => {
  const { t, schema, value } = params;

  const validationSchema = Yup.object()
    .shape(schema)
    .noUnknown(true, t(`@general/INVALID_REQUEST`, 'Invalid request.'));

  try {
    validationSchema.validateSync(value, {
      abortEarly: false,
      stripUnknown: false,
    });
  } catch (err) {
    if (err instanceof Yup.ValidationError)
      throw new AppError({
        key: '@general/VALIDATION_FAIL',
        message: err.errors[0],
      });
    throw new AppError({
      key: '@general/VALIDATION_FATAL_FAILURE',
      message: t(
        '@general/VALIDATION_FATAL_FAILURE',
        'Validation fatal server failure.',
      ),
      statusCode: 500,
    });
  }
};

const validationMiddleware = (params: {
  schema: (t: TFunction) => ObjectShape;
  segment: keyof typeof Segments;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    validateSchema({
      value: req[Segments[params.segment]],
      t: req.t,
      schema: params.schema(req.t),
    });
    next();
  };
};

const validateRequest = validationMiddleware;

export { Segments, validateSchema, validateRequest };
