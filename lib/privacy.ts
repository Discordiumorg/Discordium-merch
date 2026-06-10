/**
 * Privacy-by-design utilities.
 *
 * IPs are anonymized BEFORE they are used in rate-limit keys, logs, or any
 * analytics pipeline. The real IP is kept in memory only long enough to check
 * the blocklist, then discarded. The server never persists raw IPs.
 *
 * For live streams: viewer IPs are anonymized to country-level only.
 * User IDs are pseudonymized for analytics so they cannot be reversed.
 */

// ── IP anonymization ──────────────────────────────────────────────────────────

/** IPv4: zero out the last octet.  1.2.3.4 → 1.2.3.0 */
export function anonymizeIpv4(ip: string): string {
  const parts = ip.split('.');
  if (parts.length !== 4) return '0.0.0.0';
  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
}

/** IPv6: keep the first /48 prefix, zero the rest. */
export function anonymizeIpv6(ip: string): string {
  const parts = ip.split(':');
  const keep = parts.slice(0, 3).map((p) => p.padStart(4, '0'));
  return `${keep.join(':')}:0000:0000:0000:0000:0000`;
}

export function anonymizeIp(ip: string): string {
  if (!ip || ip === 'unknown') return '0.0.0.0';
  if (ip.includes(':')) return anonymizeIpv6(ip);
  return anonymizeIpv4(ip);
}

// ── PII masking ───────────────────────────────────────────────────────────────

/** Show only first 2 chars + domain.  johndoe@example.com → jo*****@example.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***.***';
  const vis = local.slice(0, Math.min(2, local.length));
  return `${vis}${'*'.repeat(Math.max(0, local.length - 2))}@${domain}`;
}

/** Keep country code and last 4 digits.  +49123456789 → +49*****6789 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return '***';
  return `+${digits.slice(0, 2)}${'*'.repeat(Math.max(0, digits.length - 6))}${digits.slice(-4)}`;
}

// ── Pseudonymisation ──────────────────────────────────────────────────────────

/**
 * One-way deterministic pseudonym for analytics.
 * Cannot be reversed without the salt that only exists server-side.
 * Client-side version uses a simple hash; production should use HMAC-SHA256.
 */
export function pseudonymizeId(id: string, salt = 'aura_analytics'): string {
  const input = salt + id;
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(31, h) + input.charCodeAt(i) | 0;
  }
  return `uid_${(h >>> 0).toString(36).padStart(7, '0')}`;
}

// ── Struct PII scrubbing ──────────────────────────────────────────────────────

const PII_FIELDS = new Set([
  'email', 'phone', 'phonenumber', 'password', 'passwordhash',
  'firstname', 'lastname', 'fullname', 'name', 'address', 'street',
  'ip', 'ipaddress', 'realip', 'deviceid', 'fingerprint',
  'ssn', 'dateofbirth', 'passport', 'idnumber', 'location',
]);

export function stripPii(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = PII_FIELDS.has(k.toLowerCase()) ? '[REDACTED]' : v;
  }
  return out;
}

// ── Live stream location anonymization ───────────────────────────────────────

/**
 * For viewer analytics in live streams: show country only, never city/region.
 * Viewer IPs are anonymized to /24 prefix before geo-lookup.
 */
const COUNTRY_LABELS: Record<string, string> = {
  DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz',
  US: 'USA', GB: 'UK', FR: 'Frankreich', NL: 'Niederlande',
  IT: 'Italien', ES: 'Spanien', PL: 'Polen', SE: 'Schweden',
  NO: 'Norwegen', DK: 'Dänemark', FI: 'Finnland',
};

export function anonymizeViewerLocation(countryCode: string): string {
  return COUNTRY_LABELS[countryCode.toUpperCase()] ?? countryCode;
}

// ── Data retention helpers ────────────────────────────────────────────────────

/** Returns true if the timestamp is older than `days` days. */
export function isExpired(timestamp: number | Date, days: number): boolean {
  const ms = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
  return Date.now() - ms > days * 86_400_000;
}

export const RETENTION_POLICY = {
  chatMessages: 30,       // days
  loginEvents:  90,       // days
  blockedIps:   365,      // days
  auditLogs:    730,      // days (2 years)
  userProfiles: Infinity, // kept until account deletion
} as const;
