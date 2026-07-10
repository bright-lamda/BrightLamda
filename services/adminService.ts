import { apiClient } from '@/api/client';
import { AdminRole } from '@/types/admin';

type BackendAdminRole = 'teacher_admin' | 'system_admin';
type EducationCategory = 'ordinary_physics' | 'advanced_physics' | 'competitive_physics';
type PdfResourceType = 'note' | 'paper' | 'answer';
type PublicationType = 'physics_blog' | 'bfa_horizons';
type QuizMode = 'weekly' | 'topic' | 'competition';

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

export type AdminSubject = {
  id: string;
  name: string;
  slug: string;
};

export type InviteAdminPayload = {
  fullName: string;
  email: string;
  whatsappNumber: string;
  role: AdminRole;
};

export type CreatePdfResourcePayload = {
  type: PdfResourceType;
  name: string;
  educationCategory: EducationCategory;
  subjectId: string;
  paperKind?: 'paper_1' | 'paper_2' | 'paper_3';
};

export type CreatePublicationPayload = {
  type: PublicationType;
  title: string;
  imageUrl?: string;
  content: string;
  visibleInForum: boolean;
};

export type CreateQuizWithQuestionPayload = {
  title: string;
  mode: QuizMode;
  educationCategory: EducationCategory;
  subjectId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

const toBackendRole = (role: AdminRole): BackendAdminRole => (role === 'system-admin' ? 'system_admin' : 'teacher_admin');

export const adminService = {
  async listSubjects() {
    const response = await apiClient.get<{ subjects: AdminSubject[] }>('/subjects');
    return response.data.subjects;
  },

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

  async createPdfResource(payload: CreatePdfResourcePayload) {
    const response = await apiClient.post('/content/pdf-resources', payload);
    return response.data.item;
  },

  async createPublication(payload: CreatePublicationPayload) {
    const response = await apiClient.post('/content/publications', payload);
    return response.data.item;
  },

  async createQuizWithQuestion(payload: CreateQuizWithQuestionPayload) {
    const quizResponse = await apiClient.post('/quizzes', {
      title: payload.title,
      mode: payload.mode,
      educationCategory: payload.educationCategory,
      subjectId: payload.subjectId,
      instructions: 'Prepared from the Bright Lamda admin workspace.',
    });

    const quiz = quizResponse.data.quiz;
    const questionResponse = await apiClient.post(`/quizzes/${quiz.id}/questions`, {
      question: payload.question,
      options: payload.options,
      correctAnswer: payload.correctAnswer,
      explanation: payload.explanation,
    });

    return { quiz, question: questionResponse.data.question };
  },
};
