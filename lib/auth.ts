import crypto from 'crypto';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET ?? 'aura-secret-key-change-in-production';
const COOKIE_NAME = 'aura_session';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  isMod?: boolean;
}

function base64url(input: string | Buffer): string {
  const b = typeof input === 'string' ? Buffer.from(input) : input;
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return Buffer.from((input + pad).replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

export function signToken(payload: SessionPayload): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const data = base64url(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    })
  );
  const sig = base64url(
    crypto.createHmac('sha256', SECRET).update(`${header}.${data}`).digest()
  );
  return `${header}.${data}.${sig}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const [header, data, sig] = token.split('.');
    const expected = base64url(
      crypto.createHmac('sha256', SECRET).update(`${header}.${data}`).digest()
    );
    if (sig !== expected) return null;
    const payload = JSON.parse(base64urlDecode(data).toString()) as SessionPayload & {
      exp: number;
    };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
