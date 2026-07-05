import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  APP_ORIGIN: z.string().url().default('http://localhost:8081'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().default('bright-lamda-content'),
  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),
  DATABASE_IDLE_TIMEOUT_MS: z.coerce.number().default(30000),
  JWT_SECRET: z.string().min(32),
  AI_PROVIDER: z.enum(['groq', 'gemini', 'mock']).default('mock'),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default('llama-3.1-8b-instant'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  EMBEDDING_PROVIDER: z.enum(['supabase', 'external']).default('supabase'),
});

export const env = envSchema.parse(process.env);
