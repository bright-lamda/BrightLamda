import { PoolClient } from 'pg';
import { query } from '../db/pool.js';
import { ContentStatus } from '../domain/types.js';

interface CreateResourceInput {
  type: string;
  name: string;
  educationCategory: string;
  subjectId: string;
  authorId: string;
  status: ContentStatus;
  paperKind?: string;
}

export const contentRepository = {
  createResource: async (input: CreateResourceInput, client?: PoolClient) => {
    const executor = client ?? { query };
    const result = await executor.query(
      `
        insert into content_items (
          type, title, education_category, subject_id, author_id, status, paper_kind
        )
        values ($1, $2, $3, $4, $5, $6, $7)
        returning *
      `,
      [input.type, input.name, input.educationCategory, input.subjectId, input.authorId, input.status, input.paperKind ?? null],
    );
    return result.rows[0];
  },

  listApprovedForStudents: async () => {
    const result = await query(
      `
        select *
        from content_items
        where status = 'approved'
        order by created_at desc
      `,
    );
    return result.rows;
  },

  listPendingReview: async () => {
    const result = await query(
      `
        select ci.*, p.full_name as author_name
        from content_items ci
        join profiles p on p.id = ci.author_id
        where ci.status = 'pending_review'
        order by ci.created_at asc
      `,
    );
    return result.rows;
  },
};
