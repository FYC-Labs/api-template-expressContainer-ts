import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import helmet from 'helmet';
import routes from './routes';
import { setRequestId, errorHandler } from './routes/middlewares';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(setRequestId);

app.use(routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
