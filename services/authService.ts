import { apiClient, setAuthToken } from '@/api/client';
import { LoginCredentials, RegisterPayload, StudentLevel, AuthSession } from '@/types/auth';
import { StudentProfile } from '@/types/user';
import { supabase } from './supabaseClient';

type BackendUser = {
  id: string;
  authUserId: string;
  role: string;
  email: string;
  fullName: string;
  educationCategory?: 'ordinary_physics' | 'advanced_physics' | 'competitive_physics' | null;
  avatarUrl?: string | null;
};

const levelToEducationCategory = (level: StudentLevel) => {
  if (level === 'advanced') return 'advanced_physics';
  if (level === 'competitive') return 'competitive_physics';
  return 'ordinary_physics';
};

const educationCategoryToLevel = (category?: BackendUser['educationCategory']): StudentLevel => {
  if (category === 'advanced_physics') return 'advanced';
  if (category === 'competitive_physics') return 'competitive';
  return 'ordinary';
};

const getCurrentCategory = (level: StudentLevel) => {
  if (level === 'advanced') return 'advanced-physics';
  if (level === 'competitive') return 'competitive-physics';
  return 'ordinary-physics';
};

const toAuthSession = (session: { access_token: string; refresh_token: string }): AuthSession => ({
  accessToken: session.access_token,
  refreshToken: session.refresh_token,
});

const toStudentProfile = (user: BackendUser, whatsappNumber = ''): StudentProfile => {
  const level = educationCategoryToLevel(user.educationCategory);

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    whatsappNumber,
    level,
    currentCategory: getCurrentCategory(level),
    subjects: [],
    avatarUrl: user.avatarUrl ?? undefined,
    onboardingCompleted: true,
    profileCompleted: true,
  };
};

const getBackendProfile = async (accessToken: string) => {
  setAuthToken(accessToken);
  const response = await apiClient.get<{ user: BackendUser }>('/auth/me');
  return response.data.user;
};

const completeBackendProfile = async (payload: RegisterPayload, accessToken: string) => {
  setAuthToken(accessToken);
  const response = await apiClient.post<{ user: BackendUser }>('/auth/profile', {
    fullName: payload.fullName,
    whatsappNumber: payload.whatsappNumber,
    educationCategory: levelToEducationCategory(payload.level),
  });

  return response.data.user;
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.session) throw new Error('No Supabase session returned');

    const session = toAuthSession(data.session);
    const user = await getBackendProfile(session.accessToken);

    return {
      session,
      user: toStudentProfile(user),
    };
  },

  register: async (payload: RegisterPayload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName,
          whatsapp_number: payload.whatsappNumber,
          education_category: levelToEducationCategory(payload.level),
        },
      },
    });

    if (error) throw error;
    if (!data.session) {
      throw new Error('Check your email to confirm your account before signing in.');
    }

    const session = toAuthSession(data.session);
    const user = await completeBackendProfile(payload, session.accessToken);

    return {
      session,
      user: toStudentProfile(user, payload.whatsappNumber),
    };
  },

  forgotPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  },

  verifyEmail: async (_code: string) => {
    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },
};
