'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle,
  Lock,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Session {
  id: string;
  device: string;
  deviceType: 'mobile' | 'desktop';
  location: string;
  lastActive: string;
  current: boolean;
}

interface LoginEntry {
  id: string;
  date: string;
  device: string;
  ip: string;
  status: 'Erfolgreich' | 'Fehlgeschlagen';
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_SESSIONS: Session[] = [
  {
    id: 's1',
    device: 'iPhone 15 Pro',
    deviceType: 'mobile',
    location: 'Berlin',
    lastActive: '🟢 Aktiv jetzt',
    current: true,
  },
  {
    id: 's2',
    device: 'MacBook Air',
    deviceType: 'desktop',
    location: 'Hamburg',
    lastActive: 'Vor 2 Tagen',
    current: false,
  },
  {
    id: 's3',
    device: 'Samsung Galaxy',
    deviceType: 'mobile',
    location: 'Frankfurt',
    lastActive: 'Vor 7 Tagen',
    current: false,
  },
];

const LOGIN_HISTORY: LoginEntry[] = [
  { id: 'l1', date: 'Heute, 09:14', device: 'iPhone 15 Pro · iOS 17', ip: '192.168.x.x', status: 'Erfolgreich' },
  { id: 'l2', date: 'Gestern, 18:22', device: 'MacBook Air · Chrome', ip: '192.168.x.x', status: 'Erfolgreich' },
  { id: 'l3', date: 'Vor 2 Tagen, 02:41', device: 'Unknown Android · Chrome', ip: '192.168.x.x', status: 'Fehlgeschlagen' },
  { id: 'l4', date: 'Vor 5 Tagen, 14:09', device: 'MacBook Air · Safari', ip: '192.168.x.x', status: 'Erfolgreich' },
  { id: 'l5', date: 'Vor 7 Tagen, 08:55', device: 'iPhone 15 Pro · iOS 17', ip: '192.168.x.x', status: 'Erfolgreich' },
];

// ─── Reusable Toggle ──────────────────────────────────────────────────────────

function PillToggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative flex-shrink-0 transition-colors duration-200 ${
        on ? 'bg-purple-500' : 'bg-white/20'
      }`}
    >
      <motion.div
        animate={{ x: on ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
      />
    </button>
  );
}

// ─── Fake QR Grid ─────────────────────────────────────────────────────────────

function FakeQR() {
  const cells = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1],
    [0,1,0,0,1,0,0,0,1,1,0,1,0,0,1,0,0,1,0],
    [1,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1],
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl">
      {cells.map((row, ri) => (
        <div key={ri} className="flex">
          {row.map((cell, ci) => (
            <div
              key={ci}
              className={`w-2.5 h-2.5 ${cell ? 'bg-black' : 'bg-white'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Password Strength ────────────────────────────────────────────────────────

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: '', color: 'bg-white/10', width: '0%' };
  if (pw.length < 6) return { label: 'Schwach', color: 'bg-red-500', width: '25%' };
  if (pw.length < 10 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) {
    return { label: 'Mittel', color: 'bg-yellow-500', width: '60%' };
  }
  return { label: 'Stark', color: 'bg-green-500', width: '100%' };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const router = useRouter();

  // ── 2FA ──
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [twoFaSheetOpen, setTwoFaSheetOpen] = useState(false);
  const [twoFaStep, setTwoFaStep] = useState<1 | 2 | 3>(1);
  const [twoFaCode, setTwoFaCode] = useState('');

  const handleTwoFaToggle = () => {
    if (twoFaEnabled) {
      setTwoFaEnabled(false);
    } else {
      setTwoFaStep(1);
      setTwoFaCode('');
      setTwoFaSheetOpen(true);
    }
  };

  const handleTwoFaCodeInput = (digit: string) => {
    if (digit === '⌫') {
      setTwoFaCode((c) => c.slice(0, -1));
      return;
    }
    if (twoFaCode.length >= 6) return;
    const next = twoFaCode + digit;
    setTwoFaCode(next);
    if (next.length === 6) {
      setTimeout(() => setTwoFaStep(3), 400);
    }
  };

  const completeTwoFa = () => {
    setTwoFaEnabled(true);
    setTwoFaSheetOpen(false);
    setTwoFaStep(1);
    setTwoFaCode('');
  };

  // ── Sessions ──
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);

  const removeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const removeAllOthers = () => {
    setSessions((prev) => prev.filter((s) => s.current));
  };

  // ── Privacy Toggles ──
  const [hideFromSearch, setHideFromSearch] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showReadReceipts, setShowReadReceipts] = useState(true);
  const [showDistance, setShowDistance] = useState(false);

  // ── Password Change ──
  const [passwordExpanded, setPasswordExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const strength = getPasswordStrength(newPassword);

  // ── Danger Zone Modals ──
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark pb-safe">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-white font-black text-xl">🔐 Sicherheit &amp; Datenschutz</h1>
        </div>
      </div>

      <div className="px-5 py-6 pb-32 space-y-6">

        {/* ── 1. Two-Factor Authentication ── */}
        <section>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
            Zwei-Faktor-Authentifizierung
          </p>
          <div className="card-glass rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  Zwei-Faktor-Auth {twoFaEnabled && (
                    <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-1.5 py-0.5 rounded-full ml-1">Aktiv</span>
                  )}
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  {twoFaEnabled ? 'Dein Konto ist zusätzlich gesichert' : 'Zusätzliche Sicherheitsebene aktivieren'}
                </p>
              </div>
              <PillToggle on={twoFaEnabled} onChange={handleTwoFaToggle} />
            </div>
          </div>
        </section>

        {/* ── 2. Active Sessions ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
              Aktive Sitzungen
            </p>
            <button
              onClick={removeAllOthers}
              className="text-red-400 text-xs font-semibold"
            >
              Alle anderen abmelden
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="card-glass rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      session.current ? 'gradient-brand' : 'bg-white/10'
                    }`}>
                      {session.deviceType === 'desktop'
                        ? <Monitor size={18} className={session.current ? 'text-white' : 'text-white/60'} />
                        : <Smartphone size={18} className={session.current ? 'text-white' : 'text-white/60'} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-sm">{session.device}</p>
                        {session.current && (
                          <span className="text-[9px] bg-green-500/20 text-green-400 font-bold px-1.5 py-0.5 rounded-full">
                            Dieses Gerät
                          </span>
                        )}
                      </div>
                      <p className="text-white/40 text-xs mt-0.5">{session.location} · {session.lastActive}</p>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => removeSession(session.id)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 text-xs font-bold"
                      >
                        Abmelden
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sessions.filter((s) => !s.current).length === 0 && sessions.length > 0 && (
              <p className="text-white/30 text-xs text-center py-2">Keine weiteren aktiven Sitzungen</p>
            )}
          </div>
        </section>

        {/* ── 3. Login History ── */}
        <section>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
            Login-Verlauf
          </p>
          <div className="card-glass rounded-2xl overflow-hidden">
            {LOGIN_HISTORY.map((entry, i) => (
              <div
                key={entry.id}
                className={`flex items-start gap-3 px-4 py-3.5 ${
                  i < LOGIN_HISTORY.length - 1 ? 'border-b border-white/5' : ''
                } ${entry.status === 'Fehlgeschlagen' ? 'bg-red-500/5' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  entry.status === 'Erfolgreich' ? 'bg-green-500/15' : 'bg-red-500/15'
                }`}>
                  {entry.status === 'Erfolgreich'
                    ? <Check size={14} className="text-green-400" strokeWidth={2.5} />
                    : <X size={14} className="text-red-400" strokeWidth={2.5} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white/80 text-sm font-medium truncate">{entry.device}</p>
                    <span className={`text-xs font-semibold flex-shrink-0 ${
                      entry.status === 'Erfolgreich' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">{entry.date} · IP: {entry.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Privacy Controls ── */}
        <section>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
            Datenschutz-Einstellungen
          </p>
          <div className="card-glass rounded-2xl overflow-hidden">
            {[
              {
                label: 'Profil für Suchmaschinen verbergen',
                desc: 'Dein Profil erscheint nicht in Google & Co.',
                on: hideFromSearch,
                set: setHideFromSearch,
              },
              {
                label: 'Online-Status anzeigen',
                desc: 'Andere sehen wann du aktiv bist',
                on: showOnlineStatus,
                set: setShowOnlineStatus,
              },
              {
                label: 'Lesebestätigungen anzeigen',
                desc: 'Andere sehen ob du Nachrichten gelesen hast',
                on: showReadReceipts,
                set: setShowReadReceipts,
              },
              {
                label: 'Entfernung anzeigen',
                desc: 'Zeige deinen ungefähren Standort auf dem Profil',
                on: showDistance,
                set: setShowDistance,
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-4 px-4 py-4 ${i < 3 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                </div>
                <PillToggle on={item.on} onChange={() => item.set(!item.on)} />
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. Password Change ── */}
        <section>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
            Passwort
          </p>
          <div className="card-glass rounded-2xl overflow-hidden">
            <button
              onClick={() => setPasswordExpanded(!passwordExpanded)}
              className="w-full flex items-center gap-3 px-4 py-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0">
                <Lock size={16} className="text-white/60" />
              </div>
              <span className="flex-1 text-left text-white/80 text-sm font-semibold">Passwort ändern</span>
              <motion.div animate={{ rotate: passwordExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className="text-white/30" />
              </motion.div>
            </button>

            <AnimatePresence>
              {passwordExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                    {/* Current password */}
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Aktuelles Passwort"
                        className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* New password */}
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Neues Passwort"
                        className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength indicator */}
                    {newPassword.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white/40 text-xs">Passwortstärke:</p>
                          <p className={`text-xs font-semibold ${
                            strength.label === 'Schwach' ? 'text-red-400' :
                            strength.label === 'Mittel' ? 'text-yellow-400' : 'text-green-400'
                          }`}>{strength.label}</p>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: strength.width }}
                            transition={{ duration: 0.3 }}
                            className={`h-full rounded-full ${strength.color}`}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Confirm password */}
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Passwort bestätigen"
                        className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <button className="w-full gradient-brand text-white font-bold py-3 rounded-2xl glow-button text-sm">
                      Passwort speichern
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── 6. Danger Zone ── */}
        <section>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
            Gefahrenzone
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setDeactivateModalOpen(true)}
              className="w-full card-glass rounded-2xl p-4 flex items-center gap-3 border border-yellow-500/20 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-yellow-400 font-semibold text-sm">Konto vorübergehend deaktivieren</p>
                <p className="text-white/40 text-xs mt-0.5">Dein Profil wird ausgeblendet, Daten bleiben erhalten</p>
              </div>
            </button>

            <button
              onClick={() => setDeleteModalOpen(true)}
              className="w-full card-glass rounded-2xl p-4 flex items-center gap-3 border border-red-500/20 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <X size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-semibold text-sm">Konto permanent löschen</p>
                <p className="text-white/40 text-xs mt-0.5">Alle Daten werden unwiderruflich gelöscht</p>
              </div>
            </button>
          </div>
        </section>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          2FA Setup Sheet
      ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {twoFaSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setTwoFaSheetOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-brand-card border border-white/10 rounded-t-3xl px-5 pt-5 pb-10"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      twoFaStep >= step ? 'gradient-brand text-white' : 'bg-white/10 text-white/30'
                    }`}>
                      {twoFaStep > step ? <Check size={12} strokeWidth={3} /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-8 h-0.5 rounded-full transition-all ${twoFaStep > step ? 'bg-purple-500' : 'bg-white/10'}`} />
                    )}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">

                {/* Step 1: Install App */}
                {twoFaStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-4">📲</div>
                    <h2 className="text-white font-black text-xl mb-2">Authenticator-App installieren</h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-6">
                      Lade eine Authenticator-App herunter, z.B. Google Authenticator oder Authy, und öffne sie für den nächsten Schritt.
                    </p>
                    <div className="flex gap-3 mb-6">
                      {['Google Authenticator', 'Authy', 'Microsoft Auth'].map((app) => (
                        <div key={app} className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">
                            {app === 'Google Authenticator' ? '🔐' : app === 'Authy' ? '🛡️' : '🔒'}
                          </div>
                          <p className="text-white/50 text-[10px] leading-tight">{app}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setTwoFaStep(2)}
                      className="w-full gradient-brand text-white font-bold py-3 rounded-2xl glow-button"
                    >
                      Weiter
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Scan QR */}
                {twoFaStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="text-center"
                  >
                    <h2 className="text-white font-black text-xl mb-2">QR-Code scannen</h2>
                    <p className="text-white/50 text-sm mb-5">
                      Öffne deine Authenticator-App und scanne diesen QR-Code.
                    </p>
                    <div className="flex justify-center mb-5">
                      <FakeQR />
                    </div>
                    <p className="text-white/30 text-xs mb-6">
                      Alternativ: <span className="font-mono text-purple-300">JBSWY3DPEHPK3PXP</span>
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setTwoFaStep(1)}
                        className="flex-1 py-3 rounded-2xl card-glass text-white/60 font-semibold text-sm"
                      >
                        Zurück
                      </button>
                      <button
                        onClick={() => setTwoFaStep(3)}
                        className="flex-1 gradient-brand text-white font-bold py-3 rounded-2xl"
                      >
                        Weiter
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Enter Code */}
                {twoFaStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                  >
                    <h2 className="text-white font-black text-xl mb-2 text-center">Code eingeben</h2>
                    <p className="text-white/50 text-sm mb-5 text-center">
                      Gib den 6-stelligen Code aus deiner Authenticator-App ein.
                    </p>

                    {/* Code display */}
                    <div className="flex gap-2 justify-center mb-5">
                      {[0,1,2,3,4,5].map((i) => (
                        <div
                          key={i}
                          className={`w-11 h-14 rounded-xl border-2 flex items-center justify-center text-white font-black text-xl transition-all ${
                            i < twoFaCode.length
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-white/15 bg-white/5'
                          }`}
                        >
                          {twoFaCode[i] ?? ''}
                        </div>
                      ))}
                    </div>

                    {/* Number pad */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, idx) => (
                        <button
                          key={idx}
                          onClick={() => d && handleTwoFaCodeInput(d)}
                          className={`h-12 rounded-xl text-lg font-bold transition-all ${
                            d ? 'card-glass text-white active:scale-95' : 'opacity-0 pointer-events-none'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>

                    <p className="text-center text-white/25 text-xs mb-4">Demo: beliebiger 6-stelliger Code</p>

                    {twoFaCode.length === 6 && (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={completeTwoFa}
                        className="w-full gradient-brand text-white font-bold py-3 rounded-2xl glow-button"
                      >
                        ✓ 2FA aktivieren
                      </motion.button>
                    )}

                    <button
                      onClick={() => setTwoFaStep(2)}
                      className="w-full mt-2 py-2.5 text-white/40 text-sm"
                    >
                      Zurück
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          Deactivate Confirm Modal
      ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deactivateModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setDeactivateModalOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-brand-card border border-white/10 rounded-t-3xl px-5 pt-5 pb-10"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">⏸️</div>
                <h3 className="text-white font-black text-xl mb-2">Konto deaktivieren?</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Dein Profil wird ausgeblendet. Deine Matches, Nachrichten und Daten bleiben erhalten. Du kannst dich jederzeit wieder anmelden.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setDeactivateModalOpen(false)}
                  className="w-full py-4 rounded-2xl bg-yellow-500/20 text-yellow-400 font-black text-base border border-yellow-500/30"
                >
                  Konto deaktivieren
                </button>
                <button
                  onClick={() => setDeactivateModalOpen(false)}
                  className="w-full py-4 rounded-2xl card-glass text-white/60 font-semibold"
                >
                  Abbrechen
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          Delete Confirm Modal
      ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-brand-card border border-white/10 rounded-t-3xl px-5 pt-5 pb-10"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-white font-black text-xl mb-2">Konto löschen?</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Alle Daten werden dauerhaft gelöscht: Matches, Nachrichten, Fotos und Einstellungen. Diese Aktion kann <span className="text-red-400 font-semibold">nicht rückgängig gemacht</span> werden.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-base"
                >
                  Konto unwiderruflich löschen
                </button>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="w-full py-4 rounded-2xl card-glass text-white/60 font-semibold"
                >
                  Abbrechen
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
