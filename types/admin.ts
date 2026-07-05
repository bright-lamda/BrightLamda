export type AdminRole = 'teacher-admin' | 'system-admin';
export type ManagedContentType = 'notes' | 'papers' | 'answers';
export type PublicationChannel = 'platform-only' | 'forum-visible';

export interface AdminAction {
  title: string;
  description: string;
  icon: string;
}

export interface PendingTeacherContent {
  id: string;
  teacherName: string;
  type: ManagedContentType;
  title: string;
  submittedAt: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  role: AdminRole;
  contact: string;
}
