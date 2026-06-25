import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  REDIS_URL: z.string().url().optional().or(z.literal('')),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_ATTEMPTS: z.string().default('5'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    REDIS_URL: process.env.REDIS_URL,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_ATTEMPTS: process.env.RATE_LIMIT_MAX_ATTEMPTS,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
    throw new Error(`Environment validation failed:\n${errors}`);
  }

  // Additional production checks
  if (result.data.NODE_ENV === 'production') {
    if (result.data.SESSION_SECRET === 'change-this-to-a-strong-random-secret-in-production') {
      throw new Error('SESSION_SECRET must be changed from the default value in production');
    }
    if (result.data.ALLOWED_ORIGINS === '*') {
      console.warn('WARNING: ALLOWED_ORIGINS is set to "*" in production. This is not recommended.');
    }
  }

  return result.data;
}

export const env = validateEnv();
