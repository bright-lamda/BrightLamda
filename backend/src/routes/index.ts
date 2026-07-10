import { Router } from 'express';
import { adminRouter } from './admin.routes.js';
import { authRouter } from './auth.routes.js';
import { aiRouter } from './ai.routes.js';
import { contentRouter } from './content.routes.js';
import { forumRouter } from './forum.routes.js';
import { healthRouter } from './health.routes.js';
import { notificationRouter } from './notification.routes.js';
import { quizRouter } from './quiz.routes.js';
import { storageRouter } from './storage.routes.js';
import { subjectRouter } from './subject.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/storage', storageRouter);
apiRouter.use('/subjects', subjectRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/content', contentRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/quizzes', quizRouter);
apiRouter.use('/forum', forumRouter);






