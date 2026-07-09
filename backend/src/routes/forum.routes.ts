import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createForumPostSchema, listForumPostsQuerySchema } from '../schemas/forum.schema.js';
import { forumService } from '../services/forum.service.js';

export const forumRouter = Router();

forumRouter.get('/posts', authenticate, async (req, res) => {
  const result = listForumPostsQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(422).json({ message: 'Validation failed', issues: result.error.issues });
  }

  const posts = await forumService.listPosts(result.data);
  return res.json({ posts });
});

forumRouter.post('/posts', authenticate, validateBody(createForumPostSchema), async (req, res) => {
  const post = await forumService.createPost({
    user: req.user!,
    title: req.body.title,
    body: req.body.body,
    channel: req.body.channel,
    contentItemId: req.body.contentItemId,
  });

  res.status(201).json({ post });
});
