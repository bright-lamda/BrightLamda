import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { askBrightAiSchema, createAiIngestionJobSchema } from '../schemas/ai.schema.js';
import { aiService } from '../services/ai.service.js';

export const aiRouter = Router();

aiRouter.get('/conversations', authenticate, async (req, res) => {
  const conversations = await aiService.listConversations(req.user!.id);
  res.json({ conversations });
});

aiRouter.get('/conversations/:id/messages', authenticate, async (req, res) => {
  const messages = await aiService.listMessages({ conversationId: String(req.params.id), studentId: req.user!.id });
  res.json({ messages });
});

aiRouter.post('/ask', authenticate, validateBody(askBrightAiSchema), async (req, res) => {
  const result = await aiService.askBrightAi({
    studentId: req.user!.id,
    question: req.body.question,
    conversationId: req.body.conversationId,
  });

  res.json(result);
});

aiRouter.post(
  '/ingestion-jobs',
  authenticate,
  requireRole('teacher_admin', 'system_admin'),
  validateBody(createAiIngestionJobSchema),
  async (req, res) => {
    const job = await aiService.createIngestionJob({ contentItemId: req.body.contentItemId, actorRole: req.user!.role });
    res.status(201).json({ job });
  },
);
