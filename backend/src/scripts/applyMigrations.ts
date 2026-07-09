import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../db/pool.js';

const currentFile = fileURLToPath(import.meta.url);
const backendSrcDir = path.dirname(path.dirname(currentFile));
const repoRoot = path.resolve(backendSrcDir, '..', '..');
const migrationsDir = path.join(repoRoot, 'supabase', 'migrations');

const ensureMigrationsTable = async () => {
  await pool.query(`
    create table if not exists public.schema_migrations (
      version text primary key,
      applied_at timestamptz not null default now()
    )
  `);
};

const getAppliedVersions = async () => {
  const result = await pool.query<{ version: string }>('select version from public.schema_migrations order by version asc');
  return new Set(result.rows.map((row) => row.version));
};

const applyMigration = async (fileName: string) => {
  const sql = await readFile(path.join(migrationsDir, fileName), 'utf8');
  const client = await pool.connect();

  try {
    await client.query('begin');
    await client.query('select pg_advisory_xact_lock(hashtext($1))', ['bright_lamda_schema_migrations']);
    await client.query(sql);
    await client.query('insert into public.schema_migrations (version) values ($1)', [fileName]);
    await client.query('commit');
    return { fileName, status: 'applied' as const };
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
};

const run = async () => {
  await ensureMigrationsTable();
  const applied = await getAppliedVersions();
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();
  const results: Array<{ fileName: string; status: 'applied' | 'skipped' }> = [];

  for (const fileName of files) {
    if (applied.has(fileName)) {
      results.push({ fileName, status: 'skipped' });
      continue;
    }

    results.push(await applyMigration(fileName));
  }

  console.log(JSON.stringify({ migrationsDir, results }, null, 2));
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
