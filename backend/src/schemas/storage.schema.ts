import { z } from 'zod';

export const storageUploadKindSchema = z.enum([
  'note_pdf',
  'paper_pdf',
  'answer_pdf',
  'blog_image',
  'opportunity_image',
  'paper_3_video',
]);

export const createSignedUploadUrlSchema = z.object({
  kind: storageUploadKindSchema,
  fileName: z.string().min(3).max(180),
  contentType: z.string().min(3).max(120),
});

export type StorageUploadKind = z.infer<typeof storageUploadKindSchema>;
export type CreateSignedUploadUrlInput = z.infer<typeof createSignedUploadUrlSchema>;
