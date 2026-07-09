import { z } from 'zod';

export const createQuizSchema = z.object({
  title: z.string().min(3).max(160),
  mode: z.enum(['weekly', 'topic', 'competition']),
  educationCategory: z.enum(['ordinary_physics', 'advanced_physics', 'competitive_physics']).optional(),
  subjectId: z.string().uuid().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  durationMinutes: z.number().int().positive().max(240).optional(),
  instructions: z.string().max(1000).optional(),
});

export const createQuizQuestionSchema = z.object({
  question: z.string().min(3).max(2000),
  options: z.array(z.string().min(1).max(500)).min(2).max(8),
  correctAnswer: z.string().min(1).max(500),
  explanation: z.string().min(3).max(2000),
});

export const submitQuizAttemptSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      answer: z.string().min(1).max(500),
    }),
  ),
});
