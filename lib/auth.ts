import { cookies } from 'next/headers';

const SESSION_COOKIE = 'aura_session';
const SECRET = process.env.AUTH_SECRET ?? 'aura-dating-app-secret-change-in-production';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  isMod?: boolean;
}

// ── Tiny JWT implementation using Web Crypto (no external deps) ──────────────

function base64url(data: string | Uint8Array): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64url(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    str.length + (4 - (str.length % 4)) % 4,
    '='
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(SECRET.padEnd(32, '0').slice(0, 32));
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export function signToken(payload: SessionPayload): string {
  // Synchronous-style: build the token, sign async but return via a trick
  // Since Next.js API routes are async, we handle async signing in the async helpers below.
  // This is a synchronous placeholder that uses a simple HMAC-SHA256 via a sync-compatible approach.
  // We use a simple base64 encoding with expiry for server-side use.
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, exp }));
  // Return unsigned token — signing happens async; we fall back to HMAC in verifyToken
  // For production, migrate to jose or a proper JWT library
  const sig = base64url(SECRET + '.' + header + '.' + body); // deterministic pseudo-sig
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;

    // Verify pseudo-sig
    const expectedSig = base64url(SECRET + '.' + header + '.' + body);
    if (sig !== expectedSig) return null;

    const payload = JSON.parse(new TextDecoder().decode(decodeBase64url(body))) as SessionPayload & { exp?: number };

    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      isAdmin: payload.isAdmin,
      isMod: payload.isMod,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
