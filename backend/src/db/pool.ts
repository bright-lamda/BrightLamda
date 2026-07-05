import pg from 'pg';
import { env } from '../config/env.js';

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  min: env.DATABASE_POOL_MIN,
  max: env.DATABASE_POOL_MAX,
  idleTimeoutMillis: env.DATABASE_IDLE_TIMEOUT_MS,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
  application_name: 'bright-lamda-api',
});

pool.on('error', (error) => {
  console.error('Unexpected idle database client error', error);
});

export const query = <T = unknown>(text: string, params: unknown[] = []) => pool.query<T>(text, params);
