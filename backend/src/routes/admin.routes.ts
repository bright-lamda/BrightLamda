import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { contentRepository } from '../repositories/content.repository.js';

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
  const result = await query('update content_items set status = $1, reviewed_by = $2, reviewed_at = now() where id = $3 returning *', [
    'approved',
    req.user!.id,
    req.params.id,
  ]);
  res.json({ item: result.rows[0] });
});

adminRouter.post('/content/:id/reject', authenticate, requireRole('system_admin'), async (req, res) => {
  const result = await query('update content_items set status = $1, reviewed_by = $2, reviewed_at = now() where id = $3 returning *', [
    'rejected',
    req.user!.id,
    req.params.id,
  ]);
  res.json({ item: result.rows[0] });
});

adminRouter.post('/accounts', authenticate, requireRole('system_admin'), validateBody(createAdminSchema), async (req, res) => {
  res.status(201).json({ account: req.body, invitationStatus: 'pending_invite_delivery' });
});
