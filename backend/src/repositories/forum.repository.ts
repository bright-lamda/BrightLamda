import { query } from '../db/pool.js';

export type CreateForumPostInput = {
  authorId: string;
  title?: string;
  body: string;
  channel: string;
  contentItemId?: string;
  displayName?: string;
};

export const forumRepository = {
  async listPosts(input: { channel?: string; limit: number }) {
    const result = await query(
      `
        select
          fp.*,
          p.full_name as author_name,
          p.role as author_role,
          p.avatar_url as author_avatar_url,
          case
            when p.role = 'teacher_admin' then 'green'
            when p.role = 'system_admin' then 'orange'
            else null
          end as verification_color
        from forum_posts fp
        left join profiles p on p.id = fp.author_id
        where ($1::text is null or fp.channel = $1)
        order by fp.created_at desc
        limit $2
      `,
      [input.channel ?? null, input.limit],
    );

    return result.rows;
  },

  async createPost(input: CreateForumPostInput) {
    const result = await query(
      `
        insert into forum_posts (author_id, content_item_id, channel, display_name, title, body)
        values ($1, $2, $3, $4, $5, $6)
        returning *
      `,
      [input.authorId, input.contentItemId ?? null, input.channel, input.displayName ?? null, input.title ?? null, input.body],
    );

    return result.rows[0];
  },
};
