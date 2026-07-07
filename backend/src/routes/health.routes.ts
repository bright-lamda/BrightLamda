import { Router } from 'express';
import { env } from '../config/env.js';
import { getPoolStats } from '../db/pool.js';
import { databaseHealthService } from '../services/databaseHealth.service.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'bright-lamda-api',
    environment: env.NODE_ENV,
    pool: getPoolStats(),
  });
});

healthRouter.get('/database', async (_req, res) => {
  const health = await databaseHealthService.check();
  res.json(health);
});
