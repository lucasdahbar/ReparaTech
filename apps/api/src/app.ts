import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes';
import { env } from './lib/env';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);
