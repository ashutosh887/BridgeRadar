const cache = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

export function rateLimit(identifier: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = identifier;
  const entry = cache.get(key);

  if (!entry) {
    cache.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (now > entry.resetAt) {
    cache.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return ip;
}
