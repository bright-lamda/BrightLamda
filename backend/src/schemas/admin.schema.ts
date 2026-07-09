import { z } from 'zod';

export const createAdminAccountSchema = z.object({
  fullName: z.string().min(3).max(120),
  email: z.email(),
  whatsappNumber: z.string().min(8).max(30),
  role: z.enum(['teacher_admin', 'system_admin']),
});

export type CreateAdminAccountInput = z.infer<typeof createAdminAccountSchema>;
