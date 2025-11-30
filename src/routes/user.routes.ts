import { Router } from 'express';
import * as UserService from '../services/user.service';
import * as UserDTO from '../dto/user.dto';
import { requireUser } from './middlewares';

const router = Router();

router.get('/me', requireUser, async (req, res) => {
  const user = await UserService.findByEmail(req.user.email);

  res.json({
    data: UserDTO.renderCurrentUser(user),
  });
});

export default router;
