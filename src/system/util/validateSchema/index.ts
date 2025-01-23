import { ObjectShape } from 'yup/lib/object';
import { TFunction } from '@system/i18n';
import * as Yup from 'yup';
import { AppError } from '@system/errors/AppError';

interface IRequest {
  value: any;
  key: string;
  t: TFunction;
  schema: ObjectShape;
}

const validateSchema = async (params: IRequest) => {
  const { key, t, schema, value } = params;

  const validationSchema = Yup.object()
    .shape(schema)
    .noUnknown(true, t(`${key}/INVALID_REQUEST`, 'Invalid request.'));

  try {
    await validationSchema.validate(value, {
      abortEarly: false,
      stripUnknown: false,
    });
  } catch (err) {
    if (err instanceof Yup.ValidationError)
      throw new AppError({
        key: '@address_controller_get/VALIDATION_FAIL',
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

export { validateSchema };
