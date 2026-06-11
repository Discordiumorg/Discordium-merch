'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Shield, Lock, Smartphone, Globe, Eye, EyeOff,
  AlertTriangle, Check, X, ChevronRight, Key, Download,
  Trash2, Bell, Clock, MapPin, LogOut, RefreshCw, Copy,
  UserX, Phone,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

// ─── Types & Mock Data ────────────────────────────────────────────────────────

interface Session {
  id: string;
  device: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  os: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface LoginEvent {
  id: string;
  device: string;
  location: string;
  ip: string;
  timestamp: string;
  success: boolean;
  flagged?: boolean;
}

interface BlockedUser {
  id: string;
  name: string;
  seed: string;
  blockedAt: string;
}

const SESSIONS: Session[] = [
  { id: 's1', device: 'iPhone 15 Pro', deviceType: 'mobile', os: 'iOS 17', browser: 'Aura App', location: 'Berlin, DE', ip: '195.90.10.42', lastActive: 'Now', current: true },
  { id: 's2', device: 'MacBook Pro', deviceType: 'desktop', os: 'macOS', browser: 'Chrome 124', location: 'Berlin, DE', ip: '195.90.10.40', lastActive: '2h ago', current: false },
  { id: 's3', device: 'iPad Air', deviceType: 'tablet', os: 'iPadOS 17', browser: 'Safari', location: 'Munich, DE', ip: '89.204.17.5', lastActive: '3 days ago', current: false },
];

const LOGIN_HISTORY: LoginEvent[] = [
  { id: 'l1', device: 'iPhone 15 Pro · iOS 17', location: 'Berlin, DE', ip: '195.90.10.42', timestamp: 'Today, 09:14', success: true },
  { id: 'l2', device: 'MacBook Pro · Chrome', location: 'Berlin, DE', ip: '195.90.10.40', timestamp: 'Yesterday, 18:22', success: true },
  { id: 'l3', device: 'Unknown Android · Chrome', location: 'Warsaw, PL', ip: '77.234.1.45', timestamp: '3 days ago, 02:41', success: false, flagged: true },
  { id: 'l4', device: 'iPad Air · Safari', location: 'Munich, DE', ip: '89.204.17.5', timestamp: '5 days ago, 14:09', success: true },
  { id: 'l5', device: 'iPhone 15 Pro · iOS 17', location: 'Berlin, DE', ip: '195.90.10.42', timestamp: '7 days ago, 08:55', success: true },
];

const BLOCKED_USERS: BlockedUser[] = [
  { id: 'b1', name: 'Alex W.', seed: 'alex1', blockedAt: '2 weeks ago' },
  { id: 'b2', name: 'Marco D.', seed: 'marco1', blockedAt: '1 month ago' },
];

const DEVICE_ICON = { mobile: '📱', desktop: '💻', tablet: '📱' };

// ─── Security Score Calculator ────────────────────────────────────────────────

function calcScore(has2fa: boolean, strongPass: boolean, alertsOn: boolean, sessionsReviewed: boolean): number {
  let s = 40;
  if (has2fa) s += 30;
  if (strongPass) s += 15;
  if (alertsOn) s += 10;
  if (sessionsReviewed) s += 5;
  return s;
}

function scoreGrade(score: number): { grade: string; color: string; bg: string } {
  if (score >= 90) return { grade: 'A+', color: 'text-green-400', bg: 'bg-green-500/15' };
  if (score >= 75) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-500/15' };
  if (score >= 60) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-500/15' };
  if (score >= 45) return { grade: 'C', color: 'text-yellow-400', bg: 'bg-yellow-500/15' };
  return { grade: 'D', color: 'text-red-400', bg: 'bg-red-500/15' };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'overview' | 'sessions' | '2fa' | 'privacy' | 'history'>('overview');

  // Security state
  const [has2fa, setHas2fa] = useState(false);
  const [twoFaStep, setTwoFaStep] = useState<0 | 1 | 2 | 3>(0);
  const [twoFaMethod, setTwoFaMethod] = useState<'phone' | 'email' | null>(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [backupCopied, setBackupCopied] = useState(false);
  const BACKUP_CODES = ['a4x2-j7kp', 'b8m3-n9qw', 'c1r5-s6ty', 'e0v4-u2zl', 'f3w7-x8yd'];

  // Privacy toggles
  const [showOnline, setShowOnline] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [allowMsgsFromNonMatches, setAllowMsgsFromNonMatches] = useState(false);
  const [profileInSearch, setProfileInSearch] = useState(true);
  const [readReceiptsOn, setReadReceiptsOn] = useState(true);
  const [screenshotAlerts, setScreenshotAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [blurPhotosBeforeMatch, setBlurPhotosBeforeMatch] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(BLOCKED_USERS);
  const [toast, setToast] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const score = calcScore(has2fa, true, loginAlerts, sessions.length > 0);
  const { grade, color, bg } = scoreGrade(score);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const revokeSession = (id: string) => {
    setSessions((s) => s.filter((x) => x.id !== id));
    showToast('Session revoked');
  };

  const unblock = (id: string) => {
    setBlockedUsers((b) => b.filter((x) => x.id !== id));
    showToast('User unblocked');
  };

  const copyBackupCodes = () => {
    setBackupCopied(true);
    showToast('Backup codes copied!');
    setTimeout(() => setBackupCopied(false), 3000);
  };

  const Toggle = ({ on, set }: { on: boolean; set: (v: boolean) => void }) => (
    <button
      onClick={() => set(!on)}
      className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${on ? 'bg-purple-500' : 'bg-white/20'}`}
    >
      <motion.div
        animate={{ x: on ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
      />
    </button>
  );

  const TABS = [
    { key: 'overview', label: 'Overview', icon: Shield },
    { key: 'sessions', label: 'Sessions', icon: Smartphone },
    { key: '2fa', label: '2FA', icon: Key },
    { key: 'privacy', label: 'Privacy', icon: Eye },
    { key: 'history', label: 'History', icon: Clock },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-dark pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 card-glass rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <Shield size={20} className="text-purple-400" />
            <h1 className="text-white font-black text-xl">Security & Privacy</h1>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tab === t.key ? 'gradient-brand text-white' : 'card-glass text-white/50'
              }`}
            >
              <t.icon size={12} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 pb-32">
        <AnimatePresence mode="wait">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Security Score */}
              <div className={`rounded-3xl p-5 mb-6 ${bg} border border-white/10`}>
                <div className="flex items-center gap-5">
                  <div className={`w-20 h-20 rounded-2xl ${bg} border-2 border-current ${color} flex items-center justify-center flex-shrink-0`}>
                    <span className={`font-black text-3xl ${color}`}>{grade}</span>
                  </div>
                  <div>
                    <p className="text-white font-black text-lg">Security Score: {score}/100</p>
                    <div className="w-40 h-2 bg-black/30 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${
                          score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <p className="text-white/40 text-xs mt-1">
                      {score < 70 ? 'Enable 2FA to improve your score' : 'Your account is well protected'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="card-glass rounded-3xl overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-white/5">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Security Checklist</p>
                </div>
                {[
                  { label: 'Strong password set', done: true, action: null },
                  { label: 'Email verified', done: true, action: null },
                  { label: 'Phone number linked', done: true, action: null },
                  { label: '2FA enabled', done: has2fa, action: () => setTab('2fa') },
                  { label: 'Login alerts active', done: loginAlerts, action: () => setTab('privacy') },
                  { label: 'Sessions reviewed', done: sessions.length <= 2, action: () => setTab('sessions') },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action ?? undefined}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 border-b border-white/5 last:border-0 ${item.action ? 'hover:bg-white/5' : ''} transition-colors`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-500/20' : 'bg-white/10'}`}>
                      {item.done ? <Check size={12} className="text-green-400" strokeWidth={3} /> : <X size={12} className="text-white/30" />}
                    </div>
                    <span className={`text-sm flex-1 text-left ${item.done ? 'text-white/60' : 'text-white'}`}>{item.label}</span>
                    {!item.done && item.action && (
                      <span className="text-xs text-purple-400 font-semibold">Fix →</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Recent alerts */}
              {LOGIN_HISTORY.filter((l) => l.flagged).length > 0 && (
                <div className="card-glass rounded-3xl p-4 mb-6 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-red-400" />
                    <p className="text-red-400 font-bold text-sm">Suspicious Activity Detected</p>
                  </div>
                  {LOGIN_HISTORY.filter((l) => l.flagged).map((log) => (
                    <div key={log.id} className="bg-red-500/10 rounded-xl p-3">
                      <p className="text-white/70 text-xs">{log.device}</p>
                      <p className="text-white/40 text-xs">{log.location} · {log.timestamp}</p>
                      <p className="text-red-400 text-xs font-semibold mt-1">Failed login attempt</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick actions */}
              <div className="card-glass rounded-3xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Quick Actions</p>
                </div>
                {[
                  { label: 'Verschlüsselung', sub: 'ECDH P-256 + AES-256-GCM Schlüssel', icon: Lock, action: () => router.push('/encryption') },
                  { label: 'Active Sessions', sub: `${sessions.length} devices`, icon: Smartphone, action: () => setTab('sessions') },
                  { label: 'Blocked Users', sub: `${blockedUsers.length} blocked`, icon: UserX, action: () => setTab('privacy') },
                  { label: 'Download My Data', sub: 'GDPR data export', icon: Download, action: () => showToast('Data export started — email in 24h') },
                  { label: 'Delete Account', sub: 'Permanent action', icon: Trash2, action: () => setShowDeleteConfirm(true), danger: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-5 py-4 border-b border-white/5 last:border-0 transition-colors ${(item as { danger?: boolean }).danger ? 'hover:bg-red-500/5' : 'hover:bg-white/5'}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${(item as { danger?: boolean }).danger ? 'bg-red-500/15' : 'bg-white/8'}`}>
                      <item.icon size={16} className={(item as { danger?: boolean }).danger ? 'text-red-400' : 'text-white/50'} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-semibold ${(item as { danger?: boolean }).danger ? 'text-red-400' : 'text-white/80'}`}>{item.label}</p>
                      <p className="text-white/30 text-xs">{item.sub}</p>
                    </div>
                    <ChevronRight size={14} className="text-white/30" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Sessions ── */}
          {tab === 'sessions' && (
            <motion.div key="sessions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/50 text-sm">{sessions.length} active devices</p>
                <button onClick={() => { setSessions((s) => s.filter((x) => x.current)); showToast('All other sessions revoked'); }}
                  className="text-red-400 text-xs font-semibold hover:text-red-300 transition-colors">
                  Revoke all others
                </button>
              </div>

              <div className="space-y-3">
                {sessions.map((session) => (
                  <motion.div key={session.id} layout className="card-glass rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${session.current ? 'gradient-brand' : 'bg-white/10'}`}>
                        {DEVICE_ICON[session.deviceType]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white font-semibold text-sm">{session.device}</p>
                          {session.current && (
                            <span className="text-[9px] bg-green-500/20 text-green-400 font-bold px-1.5 py-0.5 rounded-full">Current</span>
                          )}
                        </div>
                        <p className="text-white/40 text-xs">{session.os} · {session.browser}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-white/30 text-[10px]">
                          <MapPin size={9} />
                          <span>{session.location}</span>
                          <span>·</span>
                          <span>{session.ip}</span>
                          <span>·</span>
                          <span>{session.lastActive}</span>
                        </div>
                      </div>
                      {!session.current && (
                        <button
                          onClick={() => revokeSession(session.id)}
                          className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 text-xs font-bold hover:bg-red-500/25 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {sessions.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-white/40 text-sm">All other sessions revoked</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── 2FA ── */}
          {tab === '2fa' && (
            <motion.div key="2fa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {has2fa ? (
                <div>
                  <div className="card-glass rounded-3xl p-5 mb-6 border border-green-500/20 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Lock size={28} className="text-green-400" />
                    </div>
                    <p className="text-green-400 font-black text-lg mb-1">2FA is Active</p>
                    <p className="text-white/40 text-sm">Your account has two-factor authentication enabled via {twoFaMethod ?? 'phone'}.</p>
                  </div>

                  <div className="card-glass rounded-3xl p-5 mb-4">
                    <p className="text-white font-bold mb-1">Backup Codes</p>
                    <p className="text-white/40 text-xs mb-4">Use these if you lose access to your 2FA method. Each code can only be used once.</p>
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {BACKUP_CODES.map((code) => (
                        <div key={code} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                          <code className="text-purple-300 font-mono text-sm">{code}</code>
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                        </div>
                      ))}
                    </div>
                    <button onClick={copyBackupCodes} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 text-sm font-semibold">
                      <Copy size={14} />
                      {backupCopied ? 'Copied!' : 'Copy All Codes'}
                    </button>
                  </div>

                  <button onClick={() => { setHas2fa(false); setTwoFaStep(0); showToast('2FA disabled'); }}
                    className="w-full py-3.5 rounded-2xl bg-red-500/15 text-red-400 font-bold border border-red-500/20">
                    Disable 2FA
                  </button>
                </div>
              ) : (
                <div>
                  {twoFaStep === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="text-center mb-8">
                        <div className="text-5xl mb-4">🔐</div>
                        <h2 className="text-white font-black text-xl mb-2">Two-Factor Authentication</h2>
                        <p className="text-white/50 text-sm leading-relaxed">Add an extra layer of security. Even if someone gets your password, they can't access your account without the second factor.</p>
                      </div>
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-3 font-semibold">Choose method</p>
                      <div className="space-y-3 mb-8">
                        {[
                          { method: 'phone' as const, emoji: '📱', label: 'SMS / Phone', desc: 'Receive a code via text message' },
                          { method: 'email' as const, emoji: '📧', label: 'Email', desc: 'Receive a code via email' },
                        ].map((m) => (
                          <button
                            key={m.method}
                            onClick={() => { setTwoFaMethod(m.method); setTwoFaStep(1); }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${twoFaMethod === m.method ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 card-glass'}`}
                          >
                            <span className="text-2xl">{m.emoji}</span>
                            <div className="text-left">
                              <p className="text-white font-semibold">{m.label}</p>
                              <p className="text-white/40 text-xs">{m.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {twoFaStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <button onClick={() => setTwoFaStep(0)} className="text-white/50 text-sm mb-6 flex items-center gap-1">
                        ← Back
                      </button>
                      <h2 className="text-white font-black text-xl mb-2">Verify your {twoFaMethod === 'phone' ? 'phone' : 'email'}</h2>
                      <p className="text-white/50 text-sm mb-6">
                        We sent a 6-digit code to your {twoFaMethod === 'phone' ? 'phone number' : 'email address'}. Enter it below.
                      </p>
                      <div className="flex gap-2 justify-center mb-6">
                        {[0,1,2,3,4,5].map((i) => (
                          <div key={i} className={`w-11 h-14 rounded-xl border-2 flex items-center justify-center text-white font-black text-xl transition-colors ${
                            i < twoFaCode.length ? 'border-purple-500 bg-purple-500/10' : 'border-white/15 bg-white/5'
                          }`}>
                            {twoFaCode[i] ?? ''}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (d === '⌫') { setTwoFaCode((c) => c.slice(0, -1)); return; }
                              if (!d) return;
                              const next = twoFaCode + d;
                              setTwoFaCode(next);
                              if (next.length === 6) { setTimeout(() => setTwoFaStep(2), 300); }
                            }}
                            className={`h-12 rounded-xl text-lg font-bold transition-all ${d ? 'card-glass text-white hover:bg-white/15 active:scale-95' : 'opacity-0'}`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-white/30 text-xs">Demo: any 6-digit code works</p>
                    </motion.div>
                  )}

                  {twoFaStep === 2 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: 2, duration: 0.4 }} className="text-6xl mb-6">✅</motion.div>
                      <h2 className="text-white font-black text-2xl mb-2">2FA Enabled!</h2>
                      <p className="text-white/50 text-sm mb-8">Your account is now protected with two-factor authentication.</p>
                      <button onClick={() => { setHas2fa(true); setTwoFaStep(0); setTwoFaCode(''); }} className="w-full py-4 rounded-2xl gradient-brand text-white font-bold">
                        Save Backup Codes & Finish
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Privacy ── */}
          {tab === 'privacy' && (
            <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-5">
                {/* Visibility */}
                <div className="card-glass rounded-3xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/5">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Visibility</p>
                  </div>
                  {[
                    { label: 'Show online status', desc: 'Others can see when you\'re active', on: showOnline, set: setShowOnline },
                    { label: 'Show distance', desc: 'Approximate distance visible on profile', on: showDistance, set: setShowDistance },
                    { label: 'Appear in search results', desc: 'Your profile appears in discovery', on: profileInSearch, set: setProfileInSearch },
                    { label: 'Blur photos before match', desc: 'Photos blurred until you match', on: blurPhotosBeforeMatch, set: setBlurPhotosBeforeMatch },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{item.label}</p>
                        <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle on={item.on} set={item.set} />
                    </div>
                  ))}
                </div>

                {/* Messaging */}
                <div className="card-glass rounded-3xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/5">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Messaging</p>
                  </div>
                  {[
                    { label: 'Messages from non-matches', desc: 'Allow anyone to message you', on: allowMsgsFromNonMatches, set: setAllowMsgsFromNonMatches },
                    { label: 'Read receipts', desc: 'Let others see when you\'ve read messages', on: readReceiptsOn, set: setReadReceiptsOn },
                    { label: 'Screenshot alerts', desc: 'Notify me if someone screenshots chat', on: screenshotAlerts, set: setScreenshotAlerts },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{item.label}</p>
                        <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle on={item.on} set={item.set} />
                    </div>
                  ))}
                </div>

                {/* Alerts */}
                <div className="card-glass rounded-3xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/5">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Security Alerts</p>
                  </div>
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">New device login alert</p>
                      <p className="text-white/40 text-xs mt-0.5">Email me when a new device logs in</p>
                    </div>
                    <Toggle on={loginAlerts} set={setLoginAlerts} />
                  </div>
                </div>

                {/* Blocked users */}
                <div className="card-glass rounded-3xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/5">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Blocked Users ({blockedUsers.length})</p>
                  </div>
                  {blockedUsers.length === 0 ? (
                    <div className="px-5 py-6 text-center text-white/30 text-sm">No blocked users</div>
                  ) : (
                    blockedUsers.map((u) => (
                      <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 last:border-0">
                        <img src={`https://picsum.photos/seed/${u.seed}/60/60`} className="w-10 h-10 rounded-xl object-cover grayscale opacity-50 flex-shrink-0" alt="" />
                        <div className="flex-1">
                          <p className="text-white/50 text-sm line-through">{u.name}</p>
                          <p className="text-white/25 text-xs">Blocked {u.blockedAt}</p>
                        </div>
                        <button onClick={() => unblock(u.id)} className="text-xs text-purple-400 font-semibold hover:text-purple-300 transition-colors">Unblock</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── History ── */}
          {tab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-white/50 text-sm mb-4">Recent login activity</p>
              <div className="space-y-2">
                {LOGIN_HISTORY.map((log) => (
                  <div key={log.id} className={`card-glass rounded-2xl p-4 ${log.flagged ? 'border border-red-500/30' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${log.success ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                        {log.success ? '✅' : '🚫'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-sm font-semibold ${log.flagged ? 'text-red-400' : 'text-white'}`}>
                            {log.success ? 'Successful login' : 'Failed login attempt'}
                          </span>
                          {log.flagged && (
                            <span className="text-[9px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded-full uppercase">Suspicious</span>
                          )}
                        </div>
                        <p className="text-white/50 text-xs truncate">{log.device}</p>
                        <div className="flex items-center gap-2 mt-1 text-white/30 text-[10px] flex-wrap">
                          <span>{log.location}</span>
                          <span>·</span>
                          <span className="font-mono">{log.ip}</span>
                          <span>·</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    {log.flagged && (
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => showToast('This IP has been blocked')}
                          className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5">
                          Block IP
                        </button>
                        <button onClick={() => showToast('It wasn\'t me report sent')}
                          className="flex-1 py-2 rounded-xl bg-white/5 text-white/50 text-xs font-bold">
                          Not me
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Delete account confirm */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-brand-card border border-white/10 rounded-t-3xl px-5 pt-5 pb-12">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-white font-black text-xl mb-2">Delete Account?</h3>
                <p className="text-white/50 text-sm leading-relaxed">This will permanently delete all your data: matches, messages, photos, and preferences. This cannot be undone.</p>
              </div>
              <div className="space-y-2">
                <button onClick={() => { showToast('Account deletion scheduled — 30-day grace period active'); setShowDeleteConfirm(false); router.push('/'); }}
                  className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-base">
                  Delete My Account
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 rounded-2xl card-glass text-white/60 font-semibold">
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-brand-card border border-white/15 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl whitespace-nowrap">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
