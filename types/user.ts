import { AppRole, LearningCategoryId, StudentLevel } from './auth';

export interface Subject {
  id: string;
  name: string;
  level: StudentLevel | 'both';
  description: string;
  icon: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  level: StudentLevel;
  currentCategory: LearningCategoryId;
  subjects: Subject[];
  role?: AppRole;
  avatarUrl?: string;
  school?: string;
  region?: string;
  onboardingCompleted: boolean;
  profileCompleted: boolean;
}
