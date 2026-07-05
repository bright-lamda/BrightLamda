import { pool } from './pool.js';

export const withTransaction = async <T>(callback: (client: import('pg').PoolClient) => Promise<T>) => {
  const client = await pool.connect();

  try {
    await client.query('begin');
    const result = await callback(client);
    await client.query('commit');
    return result;
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
};
