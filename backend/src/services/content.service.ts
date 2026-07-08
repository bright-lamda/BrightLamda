import { withTransaction } from '../db/transaction.js';
import { AppRole, ContentStatus, EducationCategory, PaperKind } from '../domain/types.js';
import { contentRepository, CreateContentFileInput } from '../repositories/content.repository.js';
import { HttpError } from '../utils/httpError.js';

const statusForAuthor = (role: AppRole): ContentStatus => (role === 'teacher_admin' ? 'pending_review' : 'approved');

const forumDisplayNameFor = (type: 'physics_blog' | 'bfa_horizons', visibleInForum: boolean) => {
  if (!visibleInForum) {
    return undefined;
  }

  return type === 'physics_blog' ? 'Physics Blog' : 'BFA Horizons';
};

export const contentService = {
  createPdfResource: async (input: {
    type: 'note' | 'paper' | 'answer';
    name: string;
    educationCategory: EducationCategory;
    subjectId: string;
    authorId: string;
    authorRole: AppRole;
    paperKind?: PaperKind;
    file?: Omit<CreateContentFileInput, 'contentItemId'>;
  }) =>
    withTransaction(async (client) => {
      const status = statusForAuthor(input.authorRole);
      const item = await contentRepository.createContentItem(
        {
          type: input.type,
          title: input.name,
          educationCategory: input.educationCategory,
          subjectId: input.subjectId,
          authorId: input.authorId,
          status,
          paperKind: input.paperKind,
        },
        client,
      );

      const file = input.file
        ? await contentRepository.createContentFile({ ...input.file, contentItemId: item.id }, client)
        : undefined;

      await contentRepository.createAuditLog(
        {
          actorId: input.authorId,
          action: status === 'approved' ? 'content.created_approved' : 'content.submitted_for_review',
          entityType: 'content_item',
          entityId: item.id,
          metadata: { type: input.type, hasFile: Boolean(file) },
        },
        client,
      );

      return { ...item, files: file ? [file] : [] };
    }),

  createPublication: async (input: {
    type: 'physics_blog' | 'bfa_horizons';
    title: string;
    content: string;
    imageUrl?: string;
    imageFile?: Omit<CreateContentFileInput, 'contentItemId'>;
    visibleInForum: boolean;
    authorId: string;
    authorRole: AppRole;
  }) =>
    withTransaction(async (client) => {
      const status = statusForAuthor(input.authorRole);
      const item = await contentRepository.createContentItem(
        {
          type: input.type,
          title: input.title,
          body: input.content,
          imageUrl: input.imageUrl,
          authorId: input.authorId,
          status,
          visibleInForum: input.visibleInForum,
          forumDisplayName: forumDisplayNameFor(input.type, input.visibleInForum),
        },
        client,
      );

      const file = input.imageFile
        ? await contentRepository.createContentFile({ ...input.imageFile, contentItemId: item.id }, client)
        : undefined;

      await contentRepository.createAuditLog(
        {
          actorId: input.authorId,
          action: status === 'approved' ? 'publication.created_approved' : 'publication.submitted_for_review',
          entityType: 'content_item',
          entityId: item.id,
          metadata: { type: input.type, visibleInForum: input.visibleInForum, hasImageFile: Boolean(file) },
        },
        client,
      );

      return { ...item, files: file ? [file] : [] };
    }),

  approveContent: async (contentId: string, reviewerId: string) =>
    withTransaction(async (client) => {
      const item = await contentRepository.approveContent(contentId, reviewerId, client);

      if (!item) {
        throw new HttpError(404, 'Content item was not found or cannot be approved', 'content_not_approvable');
      }

      await contentRepository.createAuditLog(
        {
          actorId: reviewerId,
          action: 'content.approved',
          entityType: 'content_item',
          entityId: contentId,
          metadata: { previousWorkflow: 'review' },
        },
        client,
      );

      return item;
    }),

  rejectContent: async (contentId: string, reviewerId: string, reason: string) =>
    withTransaction(async (client) => {
      const item = await contentRepository.rejectContent(contentId, reviewerId, reason, client);

      if (!item) {
        throw new HttpError(404, 'Content item was not found or cannot be rejected', 'content_not_rejectable');
      }

      await contentRepository.createAuditLog(
        {
          actorId: reviewerId,
          action: 'content.rejected',
          entityType: 'content_item',
          entityId: contentId,
          metadata: { reason },
        },
        client,
      );

      return item;
    }),
};
