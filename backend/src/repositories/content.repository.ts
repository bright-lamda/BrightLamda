import { PoolClient, QueryResultRow } from 'pg';
import { query } from '../db/pool.js';
import { ContentStatus, ContentType, EducationCategory, PaperKind } from '../domain/types.js';

type DbExecutor = Pick<PoolClient, 'query'>;

export type CreateContentItemInput = {
  type: ContentType;
  title: string;
  body?: string;
  imageUrl?: string;
  educationCategory?: EducationCategory;
  subjectId?: string;
  authorId: string;
  status: ContentStatus;
  paperKind?: PaperKind;
  visibleInForum?: boolean;
  forumDisplayName?: string;
};

export type CreateContentFileInput = {
  contentItemId: string;
  storageBucket: string;
  storagePath: string;
  mimeType: string;
  sizeBytes?: number;
};

export type AuditLogInput = {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

const runQuery = <T extends QueryResultRow = QueryResultRow>(executor: DbExecutor | undefined, text: string, params: unknown[] = []) => {
  return executor ? executor.query<T>(text, params) : query<T>(text, params);
};

export const contentRepository = {
  async createContentItem(input: CreateContentItemInput, client?: PoolClient) {
    const result = await runQuery(
      client,
      `
        insert into content_items (
          type, title, body, image_url, education_category, subject_id, author_id,
          status, paper_kind, visible_in_forum, forum_display_name
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        returning *
      `,
      [
        input.type,
        input.title,
        input.body ?? null,
        input.imageUrl ?? null,
        input.educationCategory ?? null,
        input.subjectId ?? null,
        input.authorId,
        input.status,
        input.paperKind ?? null,
        input.visibleInForum ?? false,
        input.forumDisplayName ?? null,
      ],
    );

    return result.rows[0];
  },

  async createContentFile(input: CreateContentFileInput, client?: PoolClient) {
    const result = await runQuery(
      client,
      `
        insert into content_files (content_item_id, storage_bucket, storage_path, mime_type, size_bytes)
        values ($1, $2, $3, $4, $5)
        returning *
      `,
      [input.contentItemId, input.storageBucket, input.storagePath, input.mimeType, input.sizeBytes ?? null],
    );

    return result.rows[0];
  },

  async listApprovedForStudents() {
    const result = await query(
      `
        select
          ci.*,
          coalesce(json_agg(cf.*) filter (where cf.id is not null), '[]') as files
        from content_items ci
        left join content_files cf on cf.content_item_id = ci.id
        where ci.status = 'approved'
        group by ci.id
        order by ci.created_at desc
      `,
    );
    return result.rows;
  },

  async listPendingReview() {
    const result = await query(
      `
        select
          ci.*,
          p.full_name as author_name,
          p.role as author_role,
          coalesce(json_agg(cf.*) filter (where cf.id is not null), '[]') as files
        from content_items ci
        join profiles p on p.id = ci.author_id
        left join content_files cf on cf.content_item_id = ci.id
        where ci.status = 'pending_review'
        group by ci.id, p.full_name, p.role
        order by ci.created_at asc
      `,
    );
    return result.rows;
  },

  async approveContent(contentId: string, reviewerId: string, client?: PoolClient) {
    const result = await runQuery(
      client,
      `
        update content_items
        set status = 'approved', reviewed_by = $1, reviewed_at = now(), rejection_reason = null
        where id = $2 and status in ('pending_review', 'rejected', 'draft')
        returning *
      `,
      [reviewerId, contentId],
    );

    return result.rows[0] ?? null;
  },

  async rejectContent(contentId: string, reviewerId: string, reason: string, client?: PoolClient) {
    const result = await runQuery(
      client,
      `
        update content_items
        set status = 'rejected', reviewed_by = $1, reviewed_at = now(), rejection_reason = $2
        where id = $3 and status in ('pending_review', 'approved', 'draft')
        returning *
      `,
      [reviewerId, reason, contentId],
    );

    return result.rows[0] ?? null;
  },

  async createAuditLog(input: AuditLogInput, client?: PoolClient) {
    const result = await runQuery(
      client,
      `
        insert into admin_audit_logs (actor_id, action, entity_type, entity_id, metadata)
        values ($1, $2, $3, $4, $5)
        returning *
      `,
      [input.actorId, input.action, input.entityType, input.entityId ?? null, JSON.stringify(input.metadata ?? {})],
    );

    return result.rows[0];
  },
};
