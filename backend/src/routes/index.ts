import { Router } from 'express';
import { adminRouter } from './admin.routes.js';
import { aiRouter } from './ai.routes.js';
import { contentRouter } from './content.routes.js';
import { forumRouter } from './forum.routes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ ok: true, service: 'bright-lamda-api' }));
apiRouter.use('/admin', adminRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/content', contentRouter);
apiRouter.use('/forum', forumRouter);
