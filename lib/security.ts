export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

export type AuditAction =
  | 'user_banned'
  | 'user_unbanned'
  | 'ip_blocked'
  | 'ip_unblocked'
  | 'report_dismissed'
  | 'report_actioned'
  | 'content_removed'
  | 'content_approved'
  | 'waf_rule_toggled'
  | 'rate_limit_changed'
  | 'admin_login'
  | 'mod_login'
  | 'settings_changed'
  | 'data_exported';

export interface AuditLog {
  id: string;
  action: AuditAction;
  actor: string;         // admin or mod username
  actorRole: 'admin' | 'mod';
  target?: string;       // user/IP being acted on
  detail: string;
  timestamp: Date;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SecurityEvent {
  id: string;
  type: 'rate_limit' | 'blocked_ip' | 'waf_trigger' | 'failed_login' | 'suspicious' | 'ddos';
  ip: string;
  path: string;
  detail: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  country?: string;
}

export interface BlockedIp {
  id: string;
  ip: string;
  reason: string;
  blockedAt: Date;
  blockedBy: string;
  country: string;
  requestCount: number;
  permanent: boolean;
}

export interface RateLimitRule {
  id: string;
  path: string;
  maxRequests: number;
  windowSecs: number;
  enabled: boolean;
}

export interface WafRule {
  id: string;
  name: string;
  pattern: string;
  description: string;
  enabled: boolean;
  triggerCount: number;
}

const now = Date.now();
const mins = (n: number) => new Date(now - n * 60_000);
const hours = (n: number) => new Date(now - n * 3_600_000);

export const mockSecurityEvents: SecurityEvent[] = [
  { id: 'e1', type: 'rate_limit', ip: '185.220.101.45', path: '/api/auth', detail: 'Rate limit exceeded (127 req/min)', timestamp: mins(2), severity: 'warning', country: 'RU' },
  { id: 'e2', type: 'waf_trigger', ip: '103.75.20.14', path: '/api/users?q=UNION SELECT', detail: 'SQL injection attempt detected', timestamp: mins(5), severity: 'critical', country: 'CN' },
  { id: 'e3', type: 'failed_login', ip: '194.165.16.78', path: '/admin', detail: '5 failed PIN attempts in 2 minutes', timestamp: mins(12), severity: 'warning', country: 'UA' },
  { id: 'e4', type: 'ddos', ip: '45.148.10.22', path: '/*', detail: 'DDoS pattern: 3,400 req/s from single IP', timestamp: mins(18), severity: 'critical', country: 'NL' },
  { id: 'e5', type: 'waf_trigger', ip: '91.108.4.18', path: '/?q=<script>alert(1)</script>', detail: 'XSS attempt blocked', timestamp: mins(24), severity: 'critical', country: 'DE' },
  { id: 'e6', type: 'blocked_ip', ip: '185.220.101.45', path: '/', detail: 'IP auto-blocked after repeated rate limit violations', timestamp: mins(30), severity: 'info', country: 'RU' },
  { id: 'e7', type: 'suspicious', ip: '177.33.14.80', path: '/api/upload', detail: 'Unusual file type in upload attempt', timestamp: hours(1), severity: 'warning', country: 'BR' },
  { id: 'e8', type: 'rate_limit', ip: '52.87.12.9', path: '/api/matches', detail: 'Rate limit exceeded (89 req/min)', timestamp: hours(2), severity: 'warning', country: 'US' },
  { id: 'e9', type: 'failed_login', ip: '77.234.1.45', path: '/admin', detail: '3 failed PIN attempts', timestamp: hours(3), severity: 'info', country: 'PL' },
  { id: 'e10', type: 'waf_trigger', ip: '198.199.80.1', path: '/../etc/passwd', detail: 'Path traversal attempt blocked', timestamp: hours(5), severity: 'critical', country: 'US' },
];

export const mockBlockedIps: BlockedIp[] = [
  { id: 'b1', ip: '185.220.101.45', reason: 'Rate limit abuse + DDoS pattern', blockedAt: mins(30), blockedBy: 'auto', country: '🇷🇺 RU', requestCount: 8420, permanent: false },
  { id: 'b2', ip: '45.148.10.22', reason: 'DDoS attack — 3,400 req/s', blockedAt: mins(18), blockedBy: 'auto', country: '🇳🇱 NL', requestCount: 204000, permanent: true },
  { id: 'b3', ip: '103.75.20.14', reason: 'SQL injection attempts', blockedAt: mins(5), blockedBy: 'waf', country: '🇨🇳 CN', requestCount: 340, permanent: true },
  { id: 'b4', ip: '91.108.4.18', reason: 'XSS attack attempts', blockedAt: mins(24), blockedBy: 'waf', country: '🇩🇪 DE', requestCount: 120, permanent: false },
  { id: 'b5', ip: '198.199.80.1', reason: 'Path traversal attacks', blockedAt: hours(5), blockedBy: 'waf', country: '🇺🇸 US', requestCount: 67, permanent: false },
];

export const mockRateLimitRules: RateLimitRule[] = [
  { id: 'r1', path: '/api/auth/*', maxRequests: 10, windowSecs: 60, enabled: true },
  { id: 'r2', path: '/api/*', maxRequests: 60, windowSecs: 60, enabled: true },
  { id: 'r3', path: '/*', maxRequests: 300, windowSecs: 60, enabled: true },
  { id: 'r4', path: '/admin/*', maxRequests: 30, windowSecs: 60, enabled: true },
  { id: 'r5', path: '/api/upload', maxRequests: 5, windowSecs: 60, enabled: true },
];

export const mockWafRules: WafRule[] = [
  { id: 'w1', name: 'SQL Injection', pattern: 'UNION|SELECT|DROP|INSERT|DELETE', description: 'Block SQL injection patterns in query strings', enabled: true, triggerCount: 47 },
  { id: 'w2', name: 'XSS Protection', pattern: '<script|javascript:|onerror=', description: 'Block cross-site scripting attempts', enabled: true, triggerCount: 23 },
  { id: 'w3', name: 'Path Traversal', pattern: '\\.\\./|\\.\\.\\\\ ', description: 'Block directory traversal attacks', enabled: true, triggerCount: 12 },
  { id: 'w4', name: 'Code Injection', pattern: 'exec\\(|eval\\(|system\\(', description: 'Block remote code execution attempts', enabled: true, triggerCount: 8 },
  { id: 'w5', name: 'Bot Detection', pattern: 'python-requests|curl/|wget/', description: 'Flag known bot user agents', enabled: false, triggerCount: 1840 },
  { id: 'w6', name: 'Encoded Attacks', pattern: '%3cscript|%27|%22%3e', description: 'Block URL-encoded attack patterns', enabled: true, triggerCount: 31 },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'a1', action: 'admin_login', actor: 'admin', actorRole: 'admin', detail: 'Admin logged in from 192.168.1.1', timestamp: mins(5), ipAddress: '192.168.1.1', severity: 'info' },
  { id: 'a2', action: 'ip_blocked', actor: 'admin', actorRole: 'admin', target: '185.220.101.45', detail: 'Manually blocked IP for DDoS activity', timestamp: mins(8), ipAddress: '192.168.1.1', severity: 'warning' },
  { id: 'a3', action: 'user_banned', actor: 'mod_sophia', actorRole: 'mod', target: 'user_7742', detail: 'Banned for sending explicit unsolicited content', timestamp: mins(15), ipAddress: '10.0.0.42', severity: 'warning' },
  { id: 'a4', action: 'content_removed', actor: 'mod_sophia', actorRole: 'mod', target: 'photo_4491', detail: 'Removed profile photo violating community guidelines', timestamp: mins(22), ipAddress: '10.0.0.42', severity: 'info' },
  { id: 'a5', action: 'report_actioned', actor: 'mod_felix', actorRole: 'mod', target: 'user_1823', detail: 'Issued formal warning after harassment report', timestamp: mins(45), ipAddress: '10.0.0.55', severity: 'warning' },
  { id: 'a6', action: 'waf_rule_toggled', actor: 'admin', actorRole: 'admin', target: 'Bot Detection', detail: 'Enabled Bot Detection WAF rule', timestamp: hours(1), ipAddress: '192.168.1.1', severity: 'info' },
  { id: 'a7', action: 'report_dismissed', actor: 'mod_felix', actorRole: 'mod', target: 'report_8812', detail: 'Dismissed spam report — no violation found', timestamp: hours(1), ipAddress: '10.0.0.55', severity: 'info' },
  { id: 'a8', action: 'user_unbanned', actor: 'admin', actorRole: 'admin', target: 'user_3310', detail: 'Lifted ban after appeal review', timestamp: hours(2), ipAddress: '192.168.1.1', severity: 'info' },
  { id: 'a9', action: 'rate_limit_changed', actor: 'admin', actorRole: 'admin', target: '/api/auth/*', detail: 'Changed auth rate limit from 20 to 10 req/min', timestamp: hours(3), ipAddress: '192.168.1.1', severity: 'warning' },
  { id: 'a10', action: 'content_approved', actor: 'mod_sophia', actorRole: 'mod', target: 'photo_7723', detail: 'Approved flagged photo after manual review', timestamp: hours(4), ipAddress: '10.0.0.42', severity: 'info' },
  { id: 'a11', action: 'data_exported', actor: 'admin', actorRole: 'admin', detail: 'Full user dataset exported (GDPR compliance)', timestamp: hours(6), ipAddress: '192.168.1.1', severity: 'warning' },
  { id: 'a12', action: 'settings_changed', actor: 'admin', actorRole: 'admin', detail: 'Enabled 2FA enforcement for all admin accounts', timestamp: hours(8), ipAddress: '192.168.1.1', severity: 'warning' },
  { id: 'a13', action: 'ip_unblocked', actor: 'admin', actorRole: 'admin', target: '77.234.1.45', detail: 'Lifted IP block after false-positive review', timestamp: hours(10), ipAddress: '192.168.1.1', severity: 'info' },
  { id: 'a14', action: 'mod_login', actor: 'mod_felix', actorRole: 'mod', detail: 'Mod logged in from 10.0.0.55', timestamp: hours(12), ipAddress: '10.0.0.55', severity: 'info' },
  { id: 'a15', action: 'user_banned', actor: 'admin', actorRole: 'admin', target: 'user_0091', detail: 'Permanent ban for verified underage account', timestamp: hours(24), ipAddress: '192.168.1.1', severity: 'critical' },
];

export function getThreatLevel(events: SecurityEvent[]): ThreatLevel {
  const recent = events.filter((e) => Date.now() - e.timestamp.getTime() < 30 * 60_000);
  const criticalCount = recent.filter((e) => e.severity === 'critical').length;
  const ddos = recent.some((e) => e.type === 'ddos');
  if (ddos || criticalCount >= 3) return 'critical';
  if (criticalCount >= 1) return 'high';
  if (recent.length >= 3) return 'medium';
  return 'low';
}

export const THREAT_CONFIG: Record<ThreatLevel, { label: string; color: string; bg: string; border: string; pulse: boolean }> = {
  low: { label: 'Low', color: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30', pulse: false },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', pulse: false },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30', pulse: true },
  critical: { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40', pulse: true },
};
