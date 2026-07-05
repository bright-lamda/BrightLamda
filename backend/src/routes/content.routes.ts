import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { createPdfResourceSchema, createPublicationSchema, createQuizQuestionSchema } from '../schemas/content.schema.js';
import { contentService } from '../services/content.service.js';

export const contentRouter = Router();

contentRouter.post(
  '/pdf-resources',
  authenticate,
  requireRole('teacher_admin', 'system_admin'),
  validateBody(createPdfResourceSchema),
  async (req, res) => {
    const item = await contentService.createPdfResource({
      type: req.body.type,
      name: req.body.name,
      educationCategory: req.body.educationCategory,
      subjectId: req.body.subjectId,
      authorId: req.user!.id,
      authorRole: req.user!.role,
      paperKind: req.body.paperKind,
    });
    res.status(201).json({ item });
  },
);

contentRouter.post(
  '/publications',
  authenticate,
  requireRole('teacher_admin', 'system_admin'),
  validateBody(createPublicationSchema),
  async (req, res) => {
    res.status(201).json({ item: req.body, status: req.user!.role === 'teacher_admin' ? 'pending_review' : 'approved' });
  },
);

contentRouter.post(
  '/quiz-questions',
  authenticate,
  requireRole('teacher_admin', 'system_admin'),
  validateBody(createQuizQuestionSchema),
  async (req, res) => {
    res.status(201).json({ question: req.body });
  },
);
