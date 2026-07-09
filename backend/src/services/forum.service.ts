import { AuthUser } from '../domain/types.js';
import { forumRepository } from '../repositories/forum.repository.js';

const displayNameForPost = (user: AuthUser) => {
  if (user.role === 'teacher_admin') {
    return user.fullName;
  }

  if (user.role === 'system_admin') {
    return user.fullName;
  }

  return user.fullName;
};

export const forumService = {
  listPosts(input: { channel?: string; limit: number }) {
    return forumRepository.listPosts(input);
  },

  createPost(input: { user: AuthUser; title?: string; body: string; channel: string; contentItemId?: string }) {
    return forumRepository.createPost({
      authorId: input.user.id,
      title: input.title,
      body: input.body,
      channel: input.channel,
      contentItemId: input.contentItemId,
      displayName: displayNameForPost(input.user),
    });
  },
};
