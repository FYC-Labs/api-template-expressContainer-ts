import { Router } from 'express';
import * as UserService from '../services/user.service';

const router = Router();

router.post('/', async (_, res) => {
  const user = await UserService.create();

  res.json({
    data: {
      ts: new Date(),
    },
  });
});

export default router;
