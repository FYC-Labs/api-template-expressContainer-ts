import { Router } from 'express';
import * as PostService from '../services/post.service';
import * as PostDTO from '../dto/post.dto';
import { requireUser } from './middlewares';

const router = Router();

router.post('/me', requireUser, async (req, res) => {
  const post = await PostService.create({
    title: req.body.title,
    description: req.body.description,
    authorId: req.user.id,
  });

  res.json({
    data: PostDTO.renderOne(post),
  });
});

export default router;
