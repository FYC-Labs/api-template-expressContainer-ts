import cors from 'cors';
import express from 'express';

import helmet from 'helmet';
import routes from './routes';
import { CORS_CONFIG } from './config';

const app = express();

app.use(helmet());
app.use(cors(CORS_CONFIG));
app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
