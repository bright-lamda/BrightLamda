import { pool, query } from '../db/pool.js';

const run = async () => {
  const migrations = await query('select version from public.schema_migrations order by version');
  const subjects = await query('select slug from subjects order by slug');
  const buckets = await query(`
    select id
    from storage.buckets
    where id in ('notes','papers','answers','blog-images','opportunity-images','paper-3-videos')
    order by id
  `);

  console.log(
    JSON.stringify(
      {
        migrations: migrations.rows,
        subjects: subjects.rows,
        buckets: buckets.rows,
      },
      null,
      2,
    ),
  );
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
