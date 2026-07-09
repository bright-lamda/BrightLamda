import { z } from 'zod';

export const notificationReasonSchema = z.enum([
  'announcement',
  'quiz_reminder',
  'forum_reply',
  'ai_message',
  'new_content',
  'competition',
  'opportunity',
  'system',
]);

export const createNotificationSchema = z.object({
  recipientId: z.string().uuid().optional(),
  audience: z.enum(['all_students', 'ordinary_physics', 'advanced_physics', 'competitive_physics']).optional(),
  reason: notificationReasonSchema,
  title: z.string().min(3).max(180),
  body: z.string().min(3).max(2000),
  data: z.record(z.string(), z.unknown()).default({}),
}).refine((value) => value.recipientId || value.audience, {
  message: 'Provide either recipientId or audience',
  path: ['recipientId'],
});

export const listNotificationsQuerySchema = z.object({
  unreadOnly: z.coerce.boolean().default(false),
  limit: z.coerce.number().int().positive().max(100).default(50),
});
