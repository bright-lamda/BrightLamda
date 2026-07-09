import { apiClient } from '@/api/client';
import { AdminRole } from '@/types/admin';

type BackendAdminRole = 'teacher_admin' | 'system_admin';

type PendingContentResponse = {
  items: PendingContentItem[];
};

export type PendingContentItem = {
  id: string;
  title: string;
  type: string;
  author_name?: string;
  author_role?: string;
  created_at?: string;
  files?: unknown[];
};

export type InviteAdminPayload = {
  fullName: string;
  email: string;
  whatsappNumber: string;
  role: AdminRole;
};

const toBackendRole = (role: AdminRole): BackendAdminRole => (role === 'system-admin' ? 'system_admin' : 'teacher_admin');

export const adminService = {
  async listPendingContent() {
    const response = await apiClient.get<PendingContentResponse>('/admin/pending-content');
    return response.data.items;
  },

  async approveContent(contentId: string) {
    const response = await apiClient.post(`/admin/content/${contentId}/approve`);
    return response.data.item;
  },

  async rejectContent(contentId: string, reason: string) {
    const response = await apiClient.post(`/admin/content/${contentId}/reject`, { reason });
    return response.data.item;
  },

  async inviteAdmin(payload: InviteAdminPayload) {
    const response = await apiClient.post('/admin/accounts', {
      fullName: payload.fullName,
      email: payload.email,
      whatsappNumber: payload.whatsappNumber,
      role: toBackendRole(payload.role),
    });

    return response.data;
  },
};
