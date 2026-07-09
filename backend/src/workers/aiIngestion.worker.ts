import { pool } from '../db/pool.js';
import { aiIngestionService } from '../services/aiIngestion.service.js';

const run = async () => {
  const results = await aiIngestionService.processNextBatch();
  console.log(JSON.stringify({ processed: results.length, results }, null, 2));
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
