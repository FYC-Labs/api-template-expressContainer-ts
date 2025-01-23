/* eslint-disable import/no-default-export */
// import * as Yup from "yup";
import { Router } from 'express';
import * as health from '@services/health.service';

// Router instance
const router = Router();

router.get('/', async (req, res, next) => {
  const { t } = req;
  try {
    const data = {
      key: 'value',
    };
    return res.status(200).json({ data });
  } catch (err) {
    return next({
      err,
      key: '@general/VALIDATION_FATAL_FAILURE',
      message: t(
        '@general/VALIDATION_FATAL_FAILURE',
        'Internal validation failure.',
      ),
    });
  }
});

router.get('/database', async (req, res, next) => {
  const { t } = req;
  try {
    const response = await health.getDbConnection();
    console.log(response);

    const data = {
      connection: 'success',
    };
    return res.status(200).json({ data });
  } catch (err) {
    return next({
      err,
      key: '@general/CONNECTION_FAILED',
      message: t('@general/CONNECTION_FAILED', 'Database Connection Failed.'),
    });
  }
});

const healthRouter = router;

export default healthRouter;
