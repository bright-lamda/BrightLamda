import { PoolClient, QueryResultRow } from 'pg';
import { query } from '../db/pool.js';

type DbExecutor = Pick<PoolClient, 'query'>;

export type AiContextChunk = {
  id: string;
  content: string;
  documentTitle: string;
  sourcePath: string | null;
};

export type AiIngestionJob = QueryResultRow & {
  id: string;
  content_item_id: string;
  status: 'queued' | 'extracting' | 'embedding' | 'completed' | 'failed';
  error_message: string | null;
};

export type IngestibleContent = QueryResultRow & {
  id: string;
  type: string;
  title: string;
  body: string | null;
  status: string;
  files: Array<{
    id: string;
    storage_bucket: string;
    storage_path: string;
    mime_type: string;
    size_bytes: number | null;
  }>;
};

const runQuery = <T extends QueryResultRow = QueryResultRow>(executor: DbExecutor | undefined, text: string, params: unknown[] = []) => {
  return executor ? executor.query<T>(text, params) : query<T>(text, params);
};

export const aiRepository = {
  async createConversation(input: { studentId: string; title: string }) {
    const result = await query(
      `
        insert into ai_conversations (student_id, title)
        values ($1, $2)
        returning *
      `,
      [input.studentId, input.title],
    );

    return result.rows[0];
  },

  async getConversationForStudent(input: { conversationId: string; studentId: string }) {
    const result = await query(
      `
        select *
        from ai_conversations
        where id = $1 and student_id = $2
        limit 1
      `,
      [input.conversationId, input.studentId],
    );

    return result.rows[0] ?? null;
  },

  async listConversations(studentId: string) {
    const result = await query(
      `
        select c.*, max(m.created_at) as last_message_at
        from ai_conversations c
        left join ai_messages m on m.conversation_id = c.id
        where c.student_id = $1
        group by c.id
        order by coalesce(max(m.created_at), c.created_at) desc
      `,
      [studentId],
    );

    return result.rows;
  },

  async listMessages(input: { conversationId: string; studentId: string }) {
    const conversation = await this.getConversationForStudent(input);

    if (!conversation) {
      return null;
    }

    const result = await query(
      `
        select *
        from ai_messages
        where conversation_id = $1
        order by created_at asc
      `,
      [input.conversationId],
    );

    return result.rows;
  },

  async createMessage(input: { conversationId: string; role: 'user' | 'assistant' | 'system'; content: string; citations?: unknown[] }) {
    const result = await query(
      `
        insert into ai_messages (conversation_id, role, content, citations)
        values ($1, $2, $3, $4)
        returning *
      `,
      [input.conversationId, input.role, input.content, JSON.stringify(input.citations ?? [])],
    );

    return result.rows[0];
  },

  async searchContext(question: string, limit = 6): Promise<AiContextChunk[]> {
    const result = await query<QueryResultRow & AiContextChunk>(
      `
        select
          c.id,
          c.content,
          d.title as "documentTitle",
          d.source_path as "sourcePath"
        from ai_chunks c
        join ai_documents d on d.id = c.document_id
        left join content_items ci on ci.id = d.content_item_id
        where ci.id is null or ci.status = 'approved'
        order by
          case when c.content ilike '%' || $1 || '%' then 0 else 1 end,
          c.created_at desc
        limit $2
      `,
      [question, limit],
    );

    return result.rows.map((row) => ({
      id: row.id,
      content: row.content,
      documentTitle: row.documentTitle,
      sourcePath: row.sourcePath,
    }));
  },

  async createIngestionJob(input: { contentItemId: string }) {
    const result = await query(
      `
        insert into ai_ingestion_jobs (content_item_id, status)
        values ($1, 'queued')
        returning *
      `,
      [input.contentItemId],
    );

    return result.rows[0];
  },

  async claimQueuedIngestionJobs(limit: number) {
    const result = await query<AiIngestionJob>(
      `
        with claimed as (
          select id
          from ai_ingestion_jobs
          where status = 'queued'
          order by created_at asc
          limit $1
          for update skip locked
        )
        update ai_ingestion_jobs jobs
        set status = 'extracting', error_message = null, updated_at = now()
        from claimed
        where jobs.id = claimed.id
        returning jobs.*
      `,
      [limit],
    );

    return result.rows;
  },

  async updateIngestionJob(input: { jobId: string; status: AiIngestionJob['status']; errorMessage?: string | null }) {
    const result = await query<AiIngestionJob>(
      `
        update ai_ingestion_jobs
        set status = $1, error_message = $2, updated_at = now()
        where id = $3
        returning *
      `,
      [input.status, input.errorMessage ?? null, input.jobId],
    );

    return result.rows[0];
  },

  async getIngestibleContent(contentItemId: string) {
    const result = await query<IngestibleContent>(
      `
        select
          ci.id,
          ci.type,
          ci.title,
          ci.body,
          ci.status,
          coalesce(json_agg(cf.*) filter (where cf.id is not null), '[]') as files
        from content_items ci
        left join content_files cf on cf.content_item_id = ci.id
        where ci.id = $1
        group by ci.id
        limit 1
      `,
      [contentItemId],
    );

    return result.rows[0] ?? null;
  },

  async replaceDocumentChunks(input: { contentItemId: string; title: string; sourcePath?: string | null; chunks: string[] }) {
    return query(
      `
        with deleted as (
          delete from ai_documents
          where content_item_id = $1
        ), inserted_document as (
          insert into ai_documents (content_item_id, title, source_path)
          values ($1, $2, $3)
          returning id
        )
        insert into ai_chunks (document_id, content, token_count)
        select inserted_document.id, chunk.content, chunk.token_count
        from inserted_document,
        unnest($4::text[], $5::int[]) as chunk(content, token_count)
        returning *
      `,
      [input.contentItemId, input.title, input.sourcePath ?? null, input.chunks, input.chunks.map((chunk) => chunk.split(/\s+/).filter(Boolean).length)],
    );
  },
};
