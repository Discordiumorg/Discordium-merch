import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limit store (resets on cold start; use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api': { max: 60, windowMs: 60_000 },
  default: { max: 300, windowMs: 60_000 },
};

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string, path: string): { allowed: boolean; remaining: number } {
  const rule = path.startsWith('/api') ? RATE_LIMITS['/api'] : RATE_LIMITS['default'];
  const key = `${ip}:${path.startsWith('/api') ? '/api' : 'default'}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rule.windowMs });
    return { allowed: true, remaining: rule.max - 1 };
  }

  entry.count += 1;
  if (entry.count > rule.max) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: rule.max - entry.count };
}

// Block list — populated dynamically in production, seeded here for demo
const BLOCKED_IPS = new Set<string>([]);

// Suspicious patterns in query strings / paths (basic WAF)
const SUSPICIOUS_PATTERNS = [
  /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b)/i, // SQLi
  /<script[\s>]/i,                                   // XSS
  /\.\.[\/\\]/,                                      // path traversal
  /\bexec\s*\(/i,                                    // code injection
  /%3cscript/i,                                      // encoded XSS
];

function isSuspicious(req: NextRequest): boolean {
  const url = req.nextUrl.toString();
  const body = req.headers.get('content-type') ?? '';
  return SUSPICIOUS_PATTERNS.some((p) => p.test(url) || p.test(body));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);

  // ── 1. IP blocklist ──────────────────────────────────────────────────────
  if (BLOCKED_IPS.has(ip)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── 2. WAF — suspicious pattern detection ────────────────────────────────
  if (isSuspicious(req)) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // ── 3. Rate limiting ─────────────────────────────────────────────────────
  const { allowed, remaining } = checkRateLimit(ip, pathname);
  if (!allowed) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': '0',
      },
    });
  }

  // ── 4. Security headers on every response ───────────────────────────────
  const res = NextResponse.next();

  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://picsum.photos blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  res.headers.set('X-RateLimit-Remaining', String(remaining));

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
