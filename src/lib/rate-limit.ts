type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  // Reuse the map between hot reloads / warm serverless invocations.
  // This is a lightweight guard. For heavier traffic, replace with Upstash/Vercel KV.
  // eslint-disable-next-line no-var
  var __bnbLabRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const store = globalThis.__bnbLabRateLimitStore || new Map<string, RateLimitEntry>();

globalThis.__bnbLabRateLimitStore = store;

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number }
) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: options.limit - 1, resetAt };
  }

  if (existing.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(options.limit - existing.count, 0),
    resetAt: existing.resetAt,
  };
}
