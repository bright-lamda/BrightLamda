import { z } from 'zod';

export const createForumPostSchema = z.object({
  title: z.string().min(3).max(180).optional(),
  body: z.string().min(2).max(5000),
  channel: z.enum(['general', 'physics', 'quiz', 'papers', 'answers', 'announcements', 'opportunities']).default('general'),
  contentItemId: z.string().uuid().optional(),
});

export const listForumPostsQuerySchema = z.object({
  channel: z.enum(['general', 'physics', 'quiz', 'papers', 'answers', 'announcements', 'opportunities']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
});
