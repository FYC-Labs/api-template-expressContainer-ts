import { Router } from 'express';
import * as userService from '@src/services/user/user.service';
import { requireUser } from '@src/middlewares/auth.middleware';
import { HTTPBadRequestError } from '@src/utils/errors';

const router = Router();

router.post('/', requireUser, async (req, res, next) => {
  try {
    if (!req.body.email) {
      throw new HTTPBadRequestError('Email is required');
    }
    const user = await userService.create({
      email: req.body.email,
    });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
