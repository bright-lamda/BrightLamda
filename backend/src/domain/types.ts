export type AppRole = 'student' | 'teacher_admin' | 'system_admin';
export type EducationCategory = 'ordinary_physics' | 'advanced_physics' | 'competitive_physics';
export type ContentType = 'note' | 'paper' | 'answer' | 'physics_blog' | 'bfa_horizons';
export type ContentStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';
export type PaperKind = 'paper_1' | 'paper_2' | 'paper_3';
export type NotificationSenderType = 'student' | 'teacher_admin' | 'system_admin' | 'bright_ai';
export type NotificationReason = 'announcement' | 'quiz_reminder' | 'forum_reply' | 'ai_message' | 'new_content' | 'competition' | 'opportunity' | 'system';

export interface AuthUser {
  id: string;
  authUserId: string;
  role: AppRole;
  email: string;
  fullName: string;
  educationCategory?: EducationCategory | null;
  avatarUrl?: string | null;
}
