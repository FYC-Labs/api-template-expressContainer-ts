import { Router } from 'express';
import * as UserService from '../services/user.service';
import * as UserDTO from '../dto/user.dto';

const router = Router();

router.post('/signup', async (_, res) => {
  const user = await UserService.create();

  res.json({
    data: UserDTO.renderOne(user),
  });
});

export default router;
