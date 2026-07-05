export type AppRole = 'student' | 'teacher_admin' | 'system_admin';
export type EducationCategory = 'ordinary_physics' | 'advanced_physics' | 'competitive_physics';
export type ContentType = 'note' | 'paper' | 'answer' | 'physics_blog' | 'bfa_horizons';
export type ContentStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';
export type PaperKind = 'paper_1' | 'paper_2' | 'paper_3';

export interface AuthUser {
  id: string;
  role: AppRole;
  email: string;
}
