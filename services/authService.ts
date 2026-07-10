import { apiClient, setAuthToken } from '@/api/client';
import { AppRole, LoginCredentials, RegisterPayload, StudentLevel, AuthSession } from '@/types/auth';
import { StudentProfile } from '@/types/user';
import { supabase } from './supabaseClient';

type BackendUser = {
  id: string;
  authUserId: string;
  role: AppRole;
  email: string;
  fullName: string;
  educationCategory?: 'ordinary_physics' | 'advanced_physics' | 'competitive_physics' | null;
  avatarUrl?: string | null;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizeText = (value: string) => value.trim();

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
    role: user.role,
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
    fullName: normalizeText(payload.fullName),
    whatsappNumber: normalizeText(payload.whatsappNumber),
    educationCategory: levelToEducationCategory(payload.level),
  });

  return response.data.user;
};

const signInAndLoadProfile = async (credentials: LoginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(credentials.email),
    password: credentials.password,
  });

  if (error) throw new Error(error.message);
  if (!data.session) throw new Error('No Supabase session returned');

  const session = toAuthSession(data.session);
  const user = await getBackendProfile(session.accessToken);

  return { session, user };
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const result = await signInAndLoadProfile(credentials);

    if (result.user.role !== 'student') {
      throw new Error('This account is an admin account. Use the admin login page.');
    }

    return {
      session: result.session,
      user: toStudentProfile(result.user),
    };
  },

  loginAdmin: async (credentials: LoginCredentials, expectedRole: Extract<AppRole, 'teacher_admin' | 'system_admin'>) => {
    const result = await signInAndLoadProfile(credentials);

    if (result.user.role !== expectedRole) {
      throw new Error(expectedRole === 'system_admin' ? 'This account is not a System Admin account.' : 'This account is not a Teacher Admin account.');
    }

    return {
      session: result.session,
      user: toStudentProfile(result.user),
    };
  },

  register: async (payload: RegisterPayload) => {
    const email = normalizeEmail(payload.email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: payload.password,
      options: {
        data: {
          full_name: normalizeText(payload.fullName),
          whatsapp_number: normalizeText(payload.whatsappNumber),
          education_category: levelToEducationCategory(payload.level),
        },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.session) {
      throw new Error('Check your email to confirm your account before signing in.');
    }

    const session = toAuthSession(data.session);
    const user = await completeBackendProfile({ ...payload, email }, session.accessToken);

    return {
      session,
      user: toStudentProfile(user, payload.whatsappNumber),
    };
  },

  forgotPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email));
    if (error) throw new Error(error.message);
    return { success: true };
  },

  verifyEmail: async (_code: string) => {
    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },
};
