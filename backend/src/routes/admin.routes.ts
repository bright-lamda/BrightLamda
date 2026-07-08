import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { contentRepository } from '../repositories/content.repository.js';
import { rejectContentSchema } from '../schemas/content.schema.js';
import { contentService } from '../services/content.service.js';

export const adminRouter = Router();

const createAdminSchema = z.object({
  fullName: z.string().min(3),
  email: z.email(),
  whatsappNumber: z.string().min(8),
  role: z.enum(['teacher_admin', 'system_admin']),
});

adminRouter.get('/pending-content', authenticate, requireRole('system_admin'), async (_req, res) => {
  res.json({ items: await contentRepository.listPendingReview() });
});

adminRouter.post('/content/:id/approve', authenticate, requireRole('system_admin'), async (req, res) => {
  const contentId = String(req.params.id);
  const item = await contentService.approveContent(contentId, req.user!.id);
  res.json({ item });
});

adminRouter.post('/content/:id/reject', authenticate, requireRole('system_admin'), validateBody(rejectContentSchema), async (req, res) => {
  const contentId = String(req.params.id);
  const item = await contentService.rejectContent(contentId, req.user!.id, req.body.reason);
  res.json({ item });
});

adminRouter.post('/accounts', authenticate, requireRole('system_admin'), validateBody(createAdminSchema), async (req, res) => {
  res.status(201).json({ account: req.body, invitationStatus: 'pending_invite_delivery' });
});

