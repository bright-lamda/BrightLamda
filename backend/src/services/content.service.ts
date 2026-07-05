import { withTransaction } from '../db/transaction.js';
import { contentRepository } from '../repositories/content.repository.js';
import { AppRole, ContentStatus } from '../domain/types.js';

const statusForAuthor = (role: AppRole): ContentStatus => (role === 'teacher_admin' ? 'pending_review' : 'approved');

export const contentService = {
  createPdfResource: async (input: {
    type: 'note' | 'paper' | 'answer';
    name: string;
    educationCategory: string;
    subjectId: string;
    authorId: string;
    authorRole: AppRole;
    paperKind?: string;
  }) =>
    withTransaction((client) =>
      contentRepository.createResource(
        {
          type: input.type,
          name: input.name,
          educationCategory: input.educationCategory,
          subjectId: input.subjectId,
          authorId: input.authorId,
          status: statusForAuthor(input.authorRole),
          paperKind: input.paperKind,
        },
        client,
      ),
    ),
};
