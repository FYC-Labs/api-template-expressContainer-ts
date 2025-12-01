import { Router } from 'express';
import healthRoutes from './health.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/health', healthRoutes);
routes.use('/posts', postRoutes);
routes.use('/users', userRoutes);

export default routes;
