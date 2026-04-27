import { Router } from 'express';
import * as PostService from '@src/services/post/post.service';
import { requireUser } from '@src/middlewares/auth.middleware';

const router = Router();

router.post('/', requireUser, async (req, res, next) => {
  try {
    const post = await PostService.create({
      title: req.body.title,
      description: req.body.description,
      authorId: req.user.id,
    });

    res.json({ data: post });
  } catch (error) {
    next(error);
  }
});

export default router;
