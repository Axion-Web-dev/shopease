import { Redis } from 'ioredis';

// Redis client for distributed rate limiting
let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });
}

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '5');

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export async function checkRateLimit(
  identifier: string,
  maxAttempts: number = RATE_LIMIT_MAX_ATTEMPTS,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const key = `ratelimit:${identifier}`;

  if (redis) {
    // Distributed rate limiting with Redis
    try {
      const pipeline = redis.pipeline();
      
      // Remove entries outside the window
      pipeline.zremrangebyscore(key, 0, windowStart);
      
      // Count current attempts
      pipeline.zcard(key);
      
      // Add current attempt
      pipeline.zadd(key, now, `${now}-${Math.random()}`);
      
      // Set expiration
      pipeline.expire(key, Math.ceil(windowMs / 1000));
      
      const results = await pipeline.exec();
      
      if (!results) {
        throw new Error('Redis pipeline failed');
      }
      
      const count = results[1][1] as number;
      const remaining = Math.max(0, maxAttempts - count);
      
      return {
        success: count <= maxAttempts,
        remaining,
        resetTime: now + windowMs,
      };
    } catch (error) {
      console.error('Redis rate limiting error, falling back to in-memory:', error);
      // Fall back to in-memory if Redis fails
    }
  }

  // Fallback to in-memory rate limiting
  const inMemoryLimit = new Map<string, { count: number; resetTime: number }>();
  
  const record = inMemoryLimit.get(identifier);
  
  if (!record || now > record.resetTime) {
    inMemoryLimit.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
  }
  
  if (record.count >= maxAttempts) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { success: true, remaining: maxAttempts - record.count, resetTime: record.resetTime };
}

export async function clearRateLimit(identifier: string): Promise<void> {
  if (redis) {
    await redis.del(`ratelimit:${identifier}`);
  }
}
