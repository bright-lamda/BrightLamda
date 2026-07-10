import { query } from '../db/pool.js';

export const subjectRepository = {
  async listActive() {
    const result = await query(
      `
        select id, name, slug, is_active, created_at
        from subjects
        where is_active = true
        order by case when slug = 'physics' then 0 else 1 end, name asc
      `,
    );

    return result.rows;
  },
};
