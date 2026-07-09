import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { createNotificationSchema, listNotificationsQuerySchema } from '../schemas/notification.schema.js';
import { notificationService } from '../services/notification.service.js';

export const notificationRouter = Router();

notificationRouter.get('/', authenticate, async (req, res) => {
  const result = listNotificationsQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(422).json({ message: 'Validation failed', issues: result.error.issues });
  }

  const notifications = await notificationService.listForUser({
    userId: req.user!.id,
    unreadOnly: result.data.unreadOnly,
    limit: result.data.limit,
  });

  res.json({ notifications });
});

notificationRouter.post(
  '/',
  authenticate,
  requireRole('teacher_admin', 'system_admin'),
  validateBody(createNotificationSchema),
  async (req, res) => {
    const notifications = await notificationService.createFromAdmin({
      actor: req.user!,
      recipientId: req.body.recipientId,
      audience: req.body.audience,
      reason: req.body.reason,
      title: req.body.title,
      body: req.body.body,
      data: req.body.data,
    });

    res.status(201).json({ count: notifications.length, notifications });
  },
);

notificationRouter.post('/:id/read', authenticate, async (req, res) => {
  const notification = await notificationService.markRead({
    notificationId: String(req.params.id),
    recipientId: req.user!.id,
  });

  res.json({ notification });
});
