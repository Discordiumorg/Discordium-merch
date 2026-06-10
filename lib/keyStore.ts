/**
 * Device-local key storage.
 *
 * Keys are kept exclusively in localStorage — they are NEVER sent to the
 * server and Aura's backend has no mechanism to request or receive them.
 * Clearing app data / using a new device requires restoring from backup.
 */

import {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  deriveConversationKey,
  getKeyFingerprint,
} from '@/lib/crypto';

const K_PUB  = 'aura_e2e_pub';
const K_PRIV = 'aura_e2e_priv';
const K_TS   = 'aura_e2e_created';
const CONV_PREFIX = 'aura_e2e_conv_';

// ── My key pair ───────────────────────────────────────────────────────────────

export async function getOrCreateMyKeyPair(): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey; fingerprint: string; createdAt: number }> {
  const pubStr  = localStorage.getItem(K_PUB);
  const privStr = localStorage.getItem(K_PRIV);
  const tsStr   = localStorage.getItem(K_TS);

  if (pubStr && privStr && tsStr) {
    const publicKey  = await importPublicKey(pubStr);
    const privateKey = await importPrivateKey(privStr);
    const fingerprint = await getKeyFingerprint(pubStr);
    return { publicKey, privateKey, fingerprint, createdAt: parseInt(tsStr, 10) };
  }

  // First run — generate fresh key pair
  const pair = await generateKeyPair();
  const pubB64 = await exportPublicKey(pair.publicKey);
  const privJwk = await exportPrivateKey(pair.privateKey);
  const ts = Date.now();

  localStorage.setItem(K_PUB, pubB64);
  localStorage.setItem(K_PRIV, privJwk);
  localStorage.setItem(K_TS, String(ts));

  const fingerprint = await getKeyFingerprint(pubB64);
  return { publicKey: pair.publicKey, privateKey: pair.privateKey, fingerprint, createdAt: ts };
}

export function getMyPublicKeyB64(): string | null {
  return localStorage.getItem(K_PUB);
}

export function clearMyKeys(): void {
  localStorage.removeItem(K_PUB);
  localStorage.removeItem(K_PRIV);
  localStorage.removeItem(K_TS);
}

// ── Per-conversation derived keys ─────────────────────────────────────────────

/**
 * Returns the AES-256-GCM key for a specific conversation.
 * The first call derives it via ECDH and caches the result in memory for the
 * session (it cannot be persisted because it's non-extractable).
 */
const convKeyCache = new Map<string, CryptoKey>();

export async function getConversationKey(
  conversationId: string,
  myPrivateKey: CryptoKey,
  partnerPublicKeyB64: string
): Promise<CryptoKey> {
  const cached = convKeyCache.get(conversationId);
  if (cached) return cached;

  const partnerPub = await importPublicKey(partnerPublicKeyB64);
  const key = await deriveConversationKey(myPrivateKey, partnerPub);
  convKeyCache.set(conversationId, key);
  return key;
}

// ── Verified contacts fingerprint store ───────────────────────────────────────

export interface VerifiedContact {
  userId: string;
  name: string;
  fingerprint: string;
  verifiedAt: number;
}

export function getVerifiedContacts(): VerifiedContact[] {
  try {
    return JSON.parse(localStorage.getItem('aura_e2e_verified') ?? '[]');
  } catch {
    return [];
  }
}

export function saveVerifiedContact(contact: VerifiedContact): void {
  const list = getVerifiedContacts().filter((c) => c.userId !== contact.userId);
  localStorage.setItem('aura_e2e_verified', JSON.stringify([...list, contact]));
}

export function removeVerifiedContact(userId: string): void {
  const list = getVerifiedContacts().filter((c) => c.userId !== userId);
  localStorage.setItem('aura_e2e_verified', JSON.stringify(list));
}
