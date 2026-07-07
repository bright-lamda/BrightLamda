import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.APP_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(pinoHttp());

app.use('/api/v1', apiRouter);
app.use(notFound);
app.use(errorHandler);

