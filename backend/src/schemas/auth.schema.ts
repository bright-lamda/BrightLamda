import { z } from 'zod';

export const completeStudentProfileSchema = z.object({
  fullName: z.string().min(3).max(120),
  whatsappNumber: z.string().min(8).max(30),
  educationCategory: z.enum(['ordinary_physics', 'advanced_physics', 'competitive_physics']),
});
