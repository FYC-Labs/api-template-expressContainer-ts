import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({
    data: {
      ts: new Date(),
    },
  });
});

export default router;
