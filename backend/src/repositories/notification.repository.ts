import { query } from '../db/pool.js';
import { EducationCategory, NotificationReason, NotificationSenderType } from '../domain/types.js';

export type CreateNotificationInput = {
  recipientId: string;
  senderId?: string;
  senderType: NotificationSenderType;
  senderName?: string;
  reason: NotificationReason;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export const notificationRepository = {
  async listForUser(input: { recipientId: string; unreadOnly: boolean; limit: number }) {
    const result = await query(
      `
        select *
        from notifications
        where recipient_id = $1
          and ($2::boolean = false or read_at is null)
        order by created_at desc
        limit $3
      `,
      [input.recipientId, input.unreadOnly, input.limit],
    );

    return result.rows;
  },

  async create(input: CreateNotificationInput) {
    const result = await query(
      `
        insert into notifications (
          recipient_id, sender_id, sender_type, sender_name, reason, type, title, body, data
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning *
      `,
      [
        input.recipientId,
        input.senderId ?? null,
        input.senderType,
        input.senderName ?? null,
        input.reason,
        mapReasonToLegacyType(input.reason),
        input.title,
        input.body,
        JSON.stringify(input.data ?? {}),
      ],
    );

    return result.rows[0];
  },

  async createForAudience(input: Omit<CreateNotificationInput, 'recipientId'> & { audience?: EducationCategory }) {
    const result = await query(
      `
        insert into notifications (
          recipient_id, sender_id, sender_type, sender_name, reason, type, title, body, data
        )
        select id, $1, $2, $3, $4, $5, $6, $7, $8
        from profiles
        where role = 'student'
          and is_active = true
          and ($9::education_category is null or education_category = $9)
        returning *
      `,
      [
        input.senderId ?? null,
        input.senderType,
        input.senderName ?? null,
        input.reason,
        mapReasonToLegacyType(input.reason),
        input.title,
        input.body,
        JSON.stringify(input.data ?? {}),
        input.audience ?? null,
      ],
    );

    return result.rows;
  },

  async markRead(input: { notificationId: string; recipientId: string }) {
    const result = await query(
      `
        update notifications
        set read_at = coalesce(read_at, now())
        where id = $1 and recipient_id = $2
        returning *
      `,
      [input.notificationId, input.recipientId],
    );

    return result.rows[0] ?? null;
  },
};

const mapReasonToLegacyType = (reason: NotificationReason) => {
  switch (reason) {
    case 'quiz_reminder':
      return 'quiz_reminder';
    case 'forum_reply':
      return 'forum_reply';
    case 'ai_message':
      return 'ai';
    case 'new_content':
      return 'content_upload';
    default:
      return 'announcement';
  }
};
