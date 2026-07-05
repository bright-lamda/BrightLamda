import { LoginCredentials, RegisterPayload, StudentLevel, AuthSession } from '@/types/auth';
import { StudentProfile } from '@/types/user';

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const createSession = (): AuthSession => ({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
});

const getCurrentCategory = (level: StudentLevel) => {
  if (level === 'advanced') return 'advanced-physics';
  if (level === 'competitive') return 'competitive-physics';
  return 'ordinary-physics';
};

const createProfile = (payload: { fullName: string; email: string; whatsappNumber: string; level: StudentLevel }): StudentProfile => ({
  id: 'student-001',
  fullName: payload.fullName,
  email: payload.email,
  whatsappNumber: payload.whatsappNumber,
  level: payload.level,
  currentCategory: getCurrentCategory(payload.level),
  subjects: [],
  onboardingCompleted: true,
  profileCompleted: false,
});

export const authService = {
  login: async (credentials: LoginCredentials) => {
    await wait();
    return {
      session: createSession(),
      user: createProfile({
        fullName: 'Bright Lamda Student',
        email: credentials.email,
        whatsappNumber: '+237 680 000 000',
        level: 'advanced',
      }),
    };
  },

  register: async (payload: RegisterPayload) => {
    await wait();
    return {
      session: createSession(),
      user: createProfile(payload),
    };
  },

  forgotPassword: async (_email: string) => {
    await wait(350);
    return { success: true };
  },

  verifyEmail: async (_code: string) => {
    await wait(350);
    return { success: true };
  },
};
