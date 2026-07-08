import { Router } from 'express';
import { adminRouter } from './admin.routes.js';
import { aiRouter } from './ai.routes.js';
import { contentRouter } from './content.routes.js';
import { forumRouter } from './forum.routes.js';
import { healthRouter } from './health.routes.js';
import { storageRouter } from './storage.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/storage', storageRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/content', contentRouter);
apiRouter.use('/forum', forumRouter);


