import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../db/pool.js';

export const forumRouter = Router();

forumRouter.get('/posts', authenticate, async (_req, res) => {
  const result = await query('select * from forum_posts order by created_at desc limit 50');
  res.json({ posts: result.rows });
});

forumRouter.post('/posts', authenticate, async (req, res) => {
  const result = await query(
    'insert into forum_posts (author_id, body, channel) values ($1, $2, $3) returning *',
    [req.user!.id, req.body.body, req.body.channel ?? 'general'],
  );
  res.status(201).json({ post: result.rows[0] });
});
