/**
 * Client-side end-to-end encryption using Web Crypto API.
 *
 * Key exchange : ECDH P-256
 * Message enc  : AES-256-GCM  (unique 96-bit IV per message)
 * Fingerprint  : SHA-256 of the raw public key, displayed as hex groups
 *
 * The private key NEVER leaves the device.
 * The server only ever receives and stores ciphertext.
 * Aura has zero access to plaintext messages.
 */

const ECDH: EcKeyGenParams = { name: 'ECDH', namedCurve: 'P-256' };
const AES: AesKeyGenParams = { name: 'AES-GCM', length: 256 };

// ── Key generation ────────────────────────────────────────────────────────────

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(ECDH, true, ['deriveKey']);
}

// ── Key serialisation ─────────────────────────────────────────────────────────

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key);
  return u8ToB64(new Uint8Array(raw));
}

export async function importPublicKey(b64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', b64ToU8(b64), ECDH, true, []);
}

/** Export the private key as a JWK string — only used for local backup. */
export async function exportPrivateKey(key: CryptoKey): Promise<string> {
  const jwk = await crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(jwk);
}

export async function importPrivateKey(jwkStr: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('jwk', JSON.parse(jwkStr), ECDH, true, ['deriveKey']);
}

/**
 * Export the private key wrapped (encrypted) with a user-supplied passphrase.
 * Safe to store or transmit — the raw private key is never exposed.
 */
export async function exportPrivateKeyEncrypted(
  privateKey: CryptoKey,
  passphrase: string
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const wrapKey = await deriveWrapKey(passphrase, salt);

  const jwk = await crypto.subtle.exportKey('jwk', privateKey);
  const plain = new TextEncoder().encode(JSON.stringify(jwk));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wrapKey, plain);

  return JSON.stringify({
    v: 1,
    salt: u8ToB64(salt),
    iv: u8ToB64(iv),
    ct: u8ToB64(new Uint8Array(ct)),
  });
}

export async function importPrivateKeyEncrypted(
  blob: string,
  passphrase: string
): Promise<CryptoKey> {
  const { salt, iv, ct } = JSON.parse(blob) as { v: number; salt: string; iv: string; ct: string };
  const wrapKey = await deriveWrapKey(passphrase, b64ToU8(salt));
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToU8(iv) }, wrapKey, b64ToU8(ct));
  return importPrivateKey(new TextDecoder().decode(plain));
}

// ── Key agreement ─────────────────────────────────────────────────────────────

/**
 * Derives a shared AES-256-GCM key from own private key + partner's public key.
 * Both sides independently derive the same key — no key transfer needed.
 * Result is non-extractable; it can only be used to encrypt/decrypt.
 */
export async function deriveConversationKey(
  myPrivateKey: CryptoKey,
  theirPublicKey: CryptoKey
): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: 'ECDH', public: theirPublicKey },
    myPrivateKey,
    AES,
    false,            // non-extractable — cannot be exported even by our own code
    ['encrypt', 'decrypt']
  );
}

// ── Encryption / Decryption ───────────────────────────────────────────────────

export interface EncryptedPayload {
  ct: string;  // base64 ciphertext
  iv: string;  // base64 IV (unique per message)
}

export async function encryptMessage(
  key: CryptoKey,
  plaintext: string
): Promise<EncryptedPayload> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  return { ct: u8ToB64(new Uint8Array(ct)), iv: u8ToB64(iv) };
}

export async function decryptMessage(
  key: CryptoKey,
  payload: EncryptedPayload
): Promise<string> {
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64ToU8(payload.iv) },
    key,
    b64ToU8(payload.ct)
  );
  return new TextDecoder().decode(plain);
}

// ── Fingerprint ───────────────────────────────────────────────────────────────

/**
 * Returns a human-readable fingerprint of a public key (SHA-256, hex groups).
 * Users can read this aloud or compare screenshots to verify they're talking
 * to who they think they are — identical to the concept behind Signal's
 * "Safety Numbers".
 */
export async function getKeyFingerprint(publicKeyB64: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', b64ToU8(publicKeyB64));
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  // Groups of 5 hex chars, 8 groups = 40 chars visible
  return (hex.match(/.{5}/g) ?? []).slice(0, 8).join(' ').toUpperCase();
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function u8ToB64(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf));
}

function b64ToU8(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function deriveWrapKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250_000, hash: 'SHA-256' },
    base,
    AES,
    false,
    ['encrypt', 'decrypt']
  );
}
