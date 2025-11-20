import { Router } from 'express';
import health from './health.routes';

const routes = Router();

routes.use('/health', health);

export default routes;
