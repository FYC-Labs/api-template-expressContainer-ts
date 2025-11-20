import cors from 'cors';
import express from 'express';

import helmet from 'helmet';
import routes from '@routes/index';
import corsConfig from '@config/cors';

const app = express();

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
