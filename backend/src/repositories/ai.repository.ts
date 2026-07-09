import { QueryResultRow } from 'pg';
import { query } from '../db/pool.js';

export type AiContextChunk = {
  id: string;
  content: string;
  documentTitle: string;
  sourcePath: string | null;
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
};
