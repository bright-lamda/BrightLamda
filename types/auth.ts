export type StudentLevel = 'ordinary' | 'advanced' | 'competitive';
export type LearningCategoryId = 'ordinary-physics' | 'advanced-physics' | 'competitive-physics';
export type AppRole = 'student' | 'teacher_admin' | 'system_admin';

export interface LearningCategory {
  id: LearningCategoryId;
  title: string;
  shortTitle: string;
  description: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  whatsappNumber: string;
  password: string;
  confirmPassword: string;
  level: StudentLevel;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
}
