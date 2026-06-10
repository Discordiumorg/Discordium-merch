import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Rate limit store (in-memory; use Redis in production) ──────────────────
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/auth': { max: 10, windowMs: 60_000 },   // strict: auth endpoints
  '/api':      { max: 60, windowMs: 60_000 },
  '/admin':    { max: 30, windowMs: 60_000 },
  '/api/upload': { max: 5, windowMs: 60_000 },
  default:     { max: 300, windowMs: 60_000 },
};

function getRateLimitRule(path: string) {
  if (path.startsWith('/api/auth')) return RATE_LIMITS['/api/auth'];
  if (path.startsWith('/api/upload')) return RATE_LIMITS['/api/upload'];
  if (path.startsWith('/api')) return RATE_LIMITS['/api'];
  if (path.startsWith('/admin')) return RATE_LIMITS['/admin'];
  return RATE_LIMITS['default'];
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string, path: string): { allowed: boolean; remaining: number; limit: number } {
  const rule = getRateLimitRule(path);
  const key = `${ip}:${path}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rule.windowMs });
    return { allowed: true, remaining: rule.max - 1, limit: rule.max };
  }

  entry.count += 1;
  if (entry.count > rule.max) {
    return { allowed: false, remaining: 0, limit: rule.max };
  }
  return { allowed: true, remaining: rule.max - entry.count, limit: rule.max };
}

// ── IP blocklist — populated dynamically in production ─────────────────────
const BLOCKED_IPS = new Set<string>([]);

// ── WAF: suspicious patterns (query strings, paths, headers) ───────────────
const SUSPICIOUS_PATTERNS = [
  /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bDELETE\b)/i, // SQLi
  /<script[\s\S]*?>/i,                                         // XSS
  /javascript\s*:/i,                                           // JS proto
  /\.\.[\/\\]/,                                                // path traversal
  /\bexec\s*\(/i,                                              // code injection
  /\beval\s*\(/i,                                              // eval injection
  /%3c\s*script/i,                                             // encoded XSS
  /%27|%22%3e/i,                                               // encoded quotes
  /\bsystem\s*\(/i,                                            // shell injection
  /\|\||\&\&/,                                                 // command chaining
];

// Known malicious user-agent fragments
const MALICIOUS_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /masscan/i,
  /nmap/i,
  /burpsuite/i,
  /dirbuster/i,
  /zgrab/i,
];

// Allowed CORS origins (expand in production)
const ALLOWED_ORIGINS = [
  'https://aura-dating.app',
  'https://www.aura-dating.app',
];

function isSuspicious(req: NextRequest): boolean {
  const url = req.nextUrl.toString();
  const ua = req.headers.get('user-agent') ?? '';
  const referer = req.headers.get('referer') ?? '';

  if (SUSPICIOUS_PATTERNS.some((p) => p.test(url) || p.test(referer))) return true;
  if (MALICIOUS_UA_PATTERNS.some((p) => p.test(ua))) return true;
  return false;
}

function isCorsRequest(req: NextRequest): boolean {
  return req.headers.has('origin') && req.nextUrl.pathname.startsWith('/api');
}

function handleCors(req: NextRequest, res: NextResponse): NextResponse {
  const origin = req.headers.get('origin') ?? '';
  const isDev = process.env.NODE_ENV === 'development';

  // In dev allow localhost; in prod restrict to ALLOWED_ORIGINS
  const allowed =
    isDev
      ? /^https?:\/\/localhost(:\d+)?$/.test(origin)
      : ALLOWED_ORIGINS.includes(origin);

  if (allowed) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.headers.set('Access-Control-Max-Age', '86400');
    res.headers.set('Vary', 'Origin');
  } else if (origin) {
    // Unknown origin — block the cross-origin request
    res.headers.set('Access-Control-Allow-Origin', 'null');
  }

  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);

  // ── 1. Preflight (OPTIONS) fast-path ──────────────────────────────────────
  if (req.method === 'OPTIONS' && isCorsRequest(req)) {
    const preflight = new NextResponse(null, { status: 204 });
    return handleCors(req, preflight);
  }

  // ── 2. IP blocklist ───────────────────────────────────────────────────────
  if (BLOCKED_IPS.has(ip)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── 3. WAF — suspicious pattern detection ─────────────────────────────────
  if (isSuspicious(req)) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // ── 4. Request size guard (block oversized bodies — 2 MB limit) ───────────
  const contentLength = parseInt(req.headers.get('content-length') ?? '0', 10);
  if (contentLength > 2 * 1024 * 1024) {
    return new NextResponse('Payload Too Large', { status: 413 });
  }

  // ── 5. Rate limiting ──────────────────────────────────────────────────────
  const { allowed, remaining, limit } = checkRateLimit(ip, pathname);
  if (!allowed) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + 60),
      },
    });
  }

  // ── 6. Clickjacking guard for admin routes ────────────────────────────────
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/mod');

  // ── 7. Build response + security headers ─────────────────────────────────
  const res = NextResponse.next();

  // CORS
  if (isCorsRequest(req)) handleCors(req, res);

  // Standard security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()'
  );
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-DNS-Prefetch-Control', 'off');
  res.headers.set('X-Download-Options', 'noopen');
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  res.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none'); // relaxed for fonts/images

  // Stricter CSP for admin routes
  const cspDirectives = isAdmin
    ? [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ]
    : [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Next.js dev
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://picsum.photos blob:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
      ];

  res.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  // Rate limit headers
  res.headers.set('X-RateLimit-Limit', String(limit));
  res.headers.set('X-RateLimit-Remaining', String(remaining));

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
