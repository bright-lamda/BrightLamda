import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { createSignedUploadUrlSchema } from '../schemas/storage.schema.js';
import { storageService } from '../services/storage.service.js';

export const storageRouter = Router();

storageRouter.post(
  '/signed-upload-url',
  authenticate,
  requireRole('teacher_admin', 'system_admin'),
  validateBody(createSignedUploadUrlSchema),
  async (req, res) => {
    const upload = await storageService.createSignedUploadUrl({
      ...req.body,
      actorId: req.user!.id,
      actorRole: req.user!.role,
    });

    res.status(201).json({ upload });
  },
);
