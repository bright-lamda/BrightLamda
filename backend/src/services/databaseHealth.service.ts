import { getPoolStats, query } from '../db/pool.js';

type DatabaseHealthRow = {
  database_time: Date;
  database_name: string;
  database_user: string;
};

export type DatabaseHealth = {
  ok: boolean;
  latencyMs: number;
  databaseTime: string;
  pool: ReturnType<typeof getPoolStats>;
  connection?: {
    database: string;
    user: string;
  };
};

export const databaseHealthService = {
  async check(): Promise<DatabaseHealth> {
    const startedAt = performance.now();
    const result = await query<DatabaseHealthRow>(
      `
        select
          now() as database_time,
          current_database() as database_name,
          current_user as database_user
      `,
    );

    const row = result.rows[0];

    return {
      ok: true,
      latencyMs: Math.round(performance.now() - startedAt),
      databaseTime: row.database_time.toISOString(),
      pool: getPoolStats(),
      connection: {
        database: row.database_name,
        user: row.database_user,
      },
    };
  },
};
