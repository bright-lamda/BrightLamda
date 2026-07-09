import { AppRole, AuthUser, EducationCategory, NotificationReason, NotificationSenderType } from '../domain/types.js';
import { notificationRepository } from '../repositories/notification.repository.js';
import { HttpError } from '../utils/httpError.js';

const senderTypeForRole = (role: AppRole): NotificationSenderType => role;

const assertAdminCanNotify = (user: AuthUser) => {
  if (user.role !== 'teacher_admin' && user.role !== 'system_admin') {
    throw new HttpError(403, 'Only admins can send notifications', 'notification_admin_required');
  }
};

const audienceToCategory = (audience?: string): EducationCategory | undefined => {
  if (!audience || audience === 'all_students') {
    return undefined;
  }

  return audience as EducationCategory;
};

export const notificationService = {
  listForUser(input: { userId: string; unreadOnly: boolean; limit: number }) {
    return notificationRepository.listForUser({ recipientId: input.userId, unreadOnly: input.unreadOnly, limit: input.limit });
  },

  async createFromAdmin(input: {
    actor: AuthUser;
    recipientId?: string;
    audience?: string;
    reason: NotificationReason;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }) {
    assertAdminCanNotify(input.actor);

    const base = {
      senderId: input.actor.id,
      senderType: senderTypeForRole(input.actor.role),
      senderName: input.actor.fullName,
      reason: input.reason,
      title: input.title,
      body: input.body,
      data: input.data,
    };

    if (input.recipientId) {
      return [await notificationRepository.create({ ...base, recipientId: input.recipientId })];
    }

    return notificationRepository.createForAudience({ ...base, audience: audienceToCategory(input.audience) });
  },

  createFromBrightAi(input: { recipientId: string; reason?: NotificationReason; title: string; body: string; data?: Record<string, unknown> }) {
    return notificationRepository.create({
      recipientId: input.recipientId,
      senderType: 'bright_ai',
      senderName: 'Bright AI',
      reason: input.reason ?? 'ai_message',
      title: input.title,
      body: input.body,
      data: input.data,
    });
  },

  async markRead(input: { notificationId: string; recipientId: string }) {
    const notification = await notificationRepository.markRead(input);

    if (!notification) {
      throw new HttpError(404, 'Notification not found', 'notification_not_found');
    }

    return notification;
  },
};
