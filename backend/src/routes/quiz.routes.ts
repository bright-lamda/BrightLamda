import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { createQuizQuestionSchema, createQuizSchema, submitQuizAttemptSchema } from '../schemas/quiz.schema.js';
import { quizService } from '../services/quiz.service.js';

export const quizRouter = Router();

const querySchema = z.object({
  educationCategory: z.enum(['ordinary_physics', 'advanced_physics', 'competitive_physics']).optional(),
  subjectId: z.string().uuid().optional(),
});

quizRouter.get('/', authenticate, async (req, res) => {
  const result = querySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(422).json({ message: 'Validation failed', issues: result.error.issues });
  }

  const quizzes = await quizService.listPublishedForStudents(result.data);
  return res.json({ quizzes });
});

quizRouter.get('/admin', authenticate, requireRole('teacher_admin', 'system_admin'), async (_req, res) => {
  const quizzes = await quizService.listAdminQuizzes();
  res.json({ quizzes });
});

quizRouter.post('/', authenticate, requireRole('teacher_admin', 'system_admin'), validateBody(createQuizSchema), async (req, res) => {
  const quiz = await quizService.createQuiz({
    ...req.body,
    createdBy: req.user!.id,
    actorRole: req.user!.role,
  });

  res.status(201).json({ quiz });
});

quizRouter.get('/:id', authenticate, async (req, res) => {
  const quiz = await quizService.getPublishedQuizForStudent(String(req.params.id));
  res.json({ quiz });
});

quizRouter.post(
  '/:id/questions',
  authenticate,
  requireRole('teacher_admin', 'system_admin'),
  validateBody(createQuizQuestionSchema),
  async (req, res) => {
    const question = await quizService.addQuestion({
      quizId: String(req.params.id),
      question: req.body.question,
      options: req.body.options,
      correctAnswer: req.body.correctAnswer,
      explanation: req.body.explanation,
      createdBy: req.user!.id,
      actorRole: req.user!.role,
    });

    res.status(201).json({ question });
  },
);

quizRouter.post('/:id/publish', authenticate, requireRole('teacher_admin', 'system_admin'), async (req, res) => {
  const quiz = await quizService.setStatus({
    quizId: String(req.params.id),
    status: 'published',
    actorId: req.user!.id,
    actorRole: req.user!.role,
  });

  res.json({ quiz });
});

quizRouter.post('/:id/archive', authenticate, requireRole('teacher_admin', 'system_admin'), async (req, res) => {
  const quiz = await quizService.setStatus({
    quizId: String(req.params.id),
    status: 'archived',
    actorId: req.user!.id,
    actorRole: req.user!.role,
  });

  res.json({ quiz });
});

quizRouter.post('/:id/attempts', authenticate, requireRole('student'), validateBody(submitQuizAttemptSchema), async (req, res) => {
  const attempt = await quizService.submitAttempt({
    quizId: String(req.params.id),
    studentId: req.user!.id,
    answers: req.body.answers,
  });

  res.status(201).json({ attempt });
});
