/* eslint-disable consistent-return */
import {
  Router, Request, Response, NextFunction,
} from 'express';
import * as fileService from '../services/file.service';

const router = Router();

router.post(
  '/upload',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filePath, fileContent } = req.body;
      await fileService.upload({ filePath, fileContent });
      next({ message: 'File uploaded successfully' });
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/signed-url',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filePath } = req.query;
      if (typeof filePath !== 'string') throw new Error('Invalid filePath');
      const url = await fileService.fetchSignedUrl({ filePath });
      return res.status(200).json({ url });
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/download',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filePath } = req.query;
      if (typeof filePath !== 'string') throw new Error('Invalid filePath');
      const content = await fileService.download({ filePath });
      next({ content: content.toString() });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  '/:filePath',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filePath } = req.params;
      await fileService.deleteFile({ filePath });
      return res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  '/edit',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filePath, newContent } = req.body;
      await fileService.edit({ filePath, newContent });
      return res.status(200).json({ message: 'File updated successfully' });
    } catch (err) {
      next(err);
    }
  },
);

router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { path } = req.query;
    if (typeof path !== 'string') throw new Error('Invalid path');
    const files = await fileService.listFiles({ path });
    return res.status(200).json({ files });
  } catch (err) {
    next(err);
  }
});

export default router;
