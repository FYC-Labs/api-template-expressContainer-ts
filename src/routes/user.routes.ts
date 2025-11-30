import { Router } from 'express';
import * as UserService from '../services/user.service';

const router = Router();

router.get('/me', async (req, res) => {
  const user = await UserService.findByEmail(req.user!);

  res.json({
    data: {
      ts: new Date(),
    },
  });
});

export default router;
