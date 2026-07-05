import { z } from 'zod';

export const createPdfResourceSchema = z.object({
  type: z.enum(['note', 'paper', 'answer']),
  name: z.string().min(3),
  educationCategory: z.enum(['ordinary_physics', 'advanced_physics', 'competitive_physics']),
  subjectId: z.string().uuid(),
  paperKind: z.enum(['paper_1', 'paper_2', 'paper_3']).optional(),
});

export const createPublicationSchema = z.object({
  type: z.enum(['physics_blog', 'bfa_horizons']),
  title: z.string().min(3),
  imageUrl: z.string().url().optional(),
  content: z.string().min(20),
  visibleInForum: z.boolean().default(false),
});

export const createQuizQuestionSchema = z.object({
  quizId: z.string().uuid(),
  question: z.string().min(3),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(3),
});
