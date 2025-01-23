import { Router } from 'express';
import health from './health.routes';

// Router instance
const routes = Router();

routes.use('/', health);
export { routes };
