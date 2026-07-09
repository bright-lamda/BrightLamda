import { z } from 'zod';

export const askBrightAiSchema = z.object({
  question: z.string().min(3).max(4000),
  conversationId: z.string().uuid().optional(),
});

export const createAiIngestionJobSchema = z.object({
  contentItemId: z.string().uuid(),
});
