import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Enter a valid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Enter your full name'),
    email: z.email('Enter a valid email address').trim().toLowerCase(),
    whatsappNumber: z
      .string()
      .min(8, 'Enter your WhatsApp number')
      .regex(/^\+?[0-9\s-]{8,18}$/, 'Enter a valid WhatsApp number'),
    password: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    level: z.enum(['ordinary', 'advanced', 'competitive'], 'Select your category'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email address').trim().toLowerCase(),
});

export const verifyEmailSchema = z.object({
  code: z.string().min(4, 'Enter the verification code'),
});

export const completeProfileSchema = z.object({
  school: z.string().min(2, 'Enter your school name'),
  region: z.string().min(2, 'Enter your region'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

