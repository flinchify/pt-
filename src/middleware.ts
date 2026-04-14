import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  cleanupStaleEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfterSec: 0 };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  return { allowed: true, remaining: maxRequests - entry.count, retryAfterSec: 0 };
}

interface RateLimitRule {
  pattern: RegExp;
  maxRequests: number;
  windowMs: number;
  keyType: 'ip' | 'session';
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const rules: RateLimitRule[] = [
  { pattern: /^\/api\/auth\//, maxRequests: 10, windowMs: MINUTE, keyType: 'ip' },
  { pattern: /^\/api\/bookings$/, maxRequests: 5, windowMs: MINUTE, keyType: 'ip' },
  { pattern: /^\/api\/contact$/, maxRequests: 5, windowMs: HOUR, keyType: 'ip' },
  { pattern: /^\/api\/newsletter$/, maxRequests: 3, windowMs: HOUR, keyType: 'ip' },
];

const DEFAULT_RULE: Omit<RateLimitRule, 'pattern'> = {
  maxRequests: 60,
  windowMs: MINUTE,
  keyType: 'ip',
};

const SKIP_PATTERNS = [
  /^\/api\/stripe\//,
];

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '0.0.0.0';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  for (const skip of SKIP_PATTERNS) {
    if (skip.test(pathname)) {
      return NextResponse.next();
    }
  }

  let rule: Omit<RateLimitRule, 'pattern'> = DEFAULT_RULE;
  for (const r of rules) {
    if (r.pattern.test(pathname)) {
      rule = r;
      break;
    }
  }

  const ip = getClientIp(request);
  const sessionId = request.cookies.get('session_id')?.value;
  const key =
    rule.keyType === 'session' && sessionId
      ? `sess:${sessionId}:${pathname}`
      : `ip:${ip}:${pathname.replace(/\/\d+/g, '/:id')}`;

  const { allowed, remaining, retryAfterSec } = checkRateLimit(key, rule.maxRequests, rule.windowMs);

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
