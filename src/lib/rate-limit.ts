import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const inMemory = new Map<string, { count: number; reset: number }>();

const upstash = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 m')
    })
  : null;

export async function rateLimit(key: string) {
  if (upstash) {
    const result = await upstash.limit(key);
    return result.success;
  }

  const now = Date.now();
  const windowMs = 60_000;
  const entry = inMemory.get(key);
  if (!entry || entry.reset < now) {
    inMemory.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count += 1;
  return true;
}
