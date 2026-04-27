import { Router } from 'express';
import * as userService from '@src/services/user/user.service';
import { HTTPUnauthorizedError } from '@src/utils/errors';
import { verifyIdToken } from '@src/lib/firebase';

const router = Router();

router.post('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new HTTPUnauthorizedError('Missing or invalid Authorization header');
    }

    const firebaseUser = await verifyIdToken(token);
    if (!firebaseUser.email) {
      throw new HTTPUnauthorizedError('Invalid or expired token');
    }

    const user = await userService.findByEmail(firebaseUser.email);
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
