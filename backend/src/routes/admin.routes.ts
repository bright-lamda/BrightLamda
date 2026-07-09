import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { contentRepository } from '../repositories/content.repository.js';
import { createAdminAccountSchema } from '../schemas/admin.schema.js';
import { rejectContentSchema } from '../schemas/content.schema.js';
import { adminAccountService } from '../services/adminAccount.service.js';
import { contentService } from '../services/content.service.js';

export const adminRouter = Router();

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

adminRouter.post('/accounts', authenticate, requireRole('system_admin'), validateBody(createAdminAccountSchema), async (req, res) => {
  const result = await adminAccountService.inviteAdmin({ ...req.body, invitedBy: req.user!.id });
  res.status(201).json(result);
});
