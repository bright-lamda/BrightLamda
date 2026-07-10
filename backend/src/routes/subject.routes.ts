import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { subjectRepository } from '../repositories/subject.repository.js';

export const subjectRouter = Router();

subjectRouter.get('/', authenticate, async (_req, res) => {
  const subjects = await subjectRepository.listActive();
  res.json({ subjects });
});
