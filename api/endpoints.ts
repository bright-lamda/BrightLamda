export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    verifyEmail: '/auth/verify-email',
    me: '/auth/me',
  },
  subjects: '/subjects',
} as const;
