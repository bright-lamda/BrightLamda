import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { completeStudentProfileSchema } from '../schemas/auth.schema.js';
import { authService, extractBearerToken } from '../services/auth.service.js';
import { profileRepository } from '../repositories/profile.repository.js';
import { HttpError } from '../utils/httpError.js';

export const authRouter = Router();

authRouter.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

authRouter.post('/profile', validateBody(completeStudentProfileSchema), async (req, res) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    throw new HttpError(401, 'Authentication required', 'authentication_required');
  }

  const supabaseUser = await authService.verifySupabaseAccessToken(token);
  const user = await profileRepository.upsertStudentProfile({
    authUserId: supabaseUser.id,
    email: supabaseUser.email,
    fullName: req.body.fullName,
    whatsappNumber: req.body.whatsappNumber,
    educationCategory: req.body.educationCategory,
  });

  res.status(201).json({ user });
});
