import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { aiService } from '../services/ai.service.js';

export const aiRouter = Router();

aiRouter.post(
  '/ask',
  authenticate,
  validateBody(z.object({ question: z.string().min(3) })),
  async (req, res) => {
    const result = await aiService.askBrightAi({ studentId: req.user!.id, question: req.body.question });
    res.json(result);
  },
);
