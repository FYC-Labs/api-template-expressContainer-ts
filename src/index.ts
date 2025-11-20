import cors from 'cors';
import express from 'express';

import helmet from 'helmet';
import routes from '@routes/routes';
import { corsConfig } from '@config/cors';

const app = express();

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(setUserMiddleware);

app.use(routes);
app.use(errorMiddleware);
