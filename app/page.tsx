'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Phone, Mail, ChevronDown, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuraLogomark } from '@/components/AuraLogo';
import { useI18n } from '@/lib/i18n';

type AuthMode = 'landing' | 'auth' | 'email' | 'phone' | 'otp';
type AuthIntent = 'login' | 'register';

// ─── SVG Provider Icons ───────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.5h3.24c1.9-1.75 2.97-4.33 2.97-7.31z" fill="#4285F4"/>
      <path d="M10 20c2.7 0 4.97-.9 6.62-2.43l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.13H1.05v2.59A10 10 0 0010 20z" fill="#34A853"/>
      <path d="M4.4 11.89A6.01 6.01 0 014.09 10c0-.66.11-1.3.31-1.9V5.51H1.05A10 10 0 000 10c0 1.61.38 3.14 1.05 4.49l3.35-2.6z" fill="#FBBC04"/>
      <path d="M10 3.96c1.47 0 2.79.51 3.82 1.5l2.87-2.87C14.96.99 12.7 0 10 0A10 10 0 001.05 5.51l3.35 2.59C5.19 5.72 7.4 3.96 10 3.96z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#1877F2"/>
      <path d="M13.9 12.7l.4-2.7h-2.6V8.3c0-.75.37-1.47 1.54-1.47H14.4V4.46S13.3 4.27 12.24 4.27c-2.14 0-3.54 1.3-3.54 3.65V10H6.3v2.7H8.7V19.9A10.1 10.1 0 0010 20c.44 0 .87-.03 1.3-.1V12.7H13.9z" fill="white"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect width="20" height="20" rx="10" fill="#000"/>
      <path d="M11.4 9.1L15.5 4.5h-1L10.85 8.4 8.05 4.5H4.5l4.32 6.28L4.5 15.5h1l3.77-4.39 3.01 4.39H16l-4.6-6.4zm-1.33 1.55l-.44-.62L5.9 5.2h1.5l2.8 4.01.44.62 3.65 5.24h-1.5l-2.98-4.42z" fill="white"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M14.27 10.56c-.02-2.05 1.67-3.05 1.75-3.1-1-1.44-2.5-1.63-3.04-1.65-1.28-.13-2.5.76-3.15.76-.65 0-1.64-.74-2.71-.72C5.7 5.87 4.23 6.7 3.42 8.03 1.77 10.73 3 14.76 4.6 16.98c.8 1.09 1.75 2.3 3 2.26 1.21-.05 1.66-.78 3.11-.78 1.45 0 1.87.78 3.14.75 1.3-.02 2.11-1.1 2.9-2.2.93-1.27 1.3-2.51 1.32-2.57-.03-.01-2.54-.97-2.56-3.88zM12.1 4.1c.65-.79 1.09-1.88.97-2.97-.94.04-2.1.63-2.77 1.4-.6.69-1.13 1.8-.99 2.87 1.05.08 2.13-.53 2.79-1.3z" fill="white"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COUNTRY_CODES = [
  { code: '+49', flag: '🇩🇪', name: 'Deutschland' },
  { code: '+1',  flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+33', flag: '🇫🇷', name: 'Frankreich' },
  { code: '+34', flag: '🇪🇸', name: 'Spanien' },
  { code: '+39', flag: '🇮🇹', name: 'Italien' },
  { code: '+351',flag: '🇵🇹', name: 'Portugal' },
  { code: '+90', flag: '🇹🇷', name: 'Türkei' },
  { code: '+41', flag: '🇨🇭', name: 'Schweiz' },
  { code: '+43', flag: '🇦🇹', name: 'Österreich' },
];

const SOCIAL_PROVIDERS = [
  { id: 'google',   label: 'Google',   icon: GoogleIcon,   bg: 'bg-white',        text: 'text-gray-800', border: 'border-white/20' },
  { id: 'facebook', label: 'Facebook', icon: FacebookIcon, bg: 'bg-[#1877F2]',    text: 'text-white',    border: 'border-transparent' },
  { id: 'apple',    label: 'Apple',    icon: AppleIcon,    bg: 'bg-[#050505]',    text: 'text-white',    border: 'border-white/10' },
  { id: 'x',        label: 'X',        icon: XIcon,        bg: 'bg-[#111]',       text: 'text-white',    border: 'border-white/10' },
];

// STATS labels are now i18n-aware; see stats array inside component

const FLOATING_SEEDS = ['aura1','aura2','aura3','aura4','aura5','aura6'];

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastState { msg: string; type: 'error' | 'success' }

function Toast({ toast, onDone }: { toast: ToastState; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [toast]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -48, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.95 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold max-w-[calc(100vw-2rem)]"
      style={{ background: toast.type === 'error' ? 'rgba(239,68,68,0.18)' : 'rgba(34,197,94,0.18)', backdropFilter: 'blur(16px)', border: toast.type === 'error' ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(34,197,94,0.35)' }}
    >
      {toast.type === 'error'
        ? <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
        : <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />}
      <span className={toast.type === 'error' ? 'text-red-300' : 'text-green-300'}>{toast.msg}</span>
    </motion.div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size = 18, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
      className="rounded-full border-2 flex-shrink-0"
      style={{ width: size, height: size, borderColor: dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)', borderTopColor: dark ? '#1a1a1a' : '#fff' }}
    />
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/45 text-[11px] font-bold uppercase tracking-widest mb-1.5">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle size={11} />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const INPUT_CLS = "w-full bg-white/6 border border-white/12 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all text-sm";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const { t } = useI18n();
  const stats = [
    { value: '2,4M+', label: t.landing.stats.users,   emoji: '👥' },
    { value: '840T',  label: t.landing.stats.matches,  emoji: '💞' },
    { value: '4,9★',  label: t.landing.stats.rating,   emoji: '⭐' },
  ];
  const [mode, setMode] = useState<AuthMode>('landing');
  const [intent, setIntent] = useState<AuthIntent>('register');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Email form
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', age: '', gender: 'female' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Phone / OTP
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showToast = useCallback((msg: string, type: 'error' | 'success' = 'error') => {
    setToast({ msg, type });
  }, []);

  // OTP countdown
  useEffect(() => {
    if (mode !== 'otp') return;
    setOtpCountdown(60);
    setCanResend(false);
    const timer = setInterval(() => {
      setOtpCountdown((n) => {
        if (n <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  const goAuth = (i: AuthIntent) => { setIntent(i); setMode('auth'); };

  const handleSocial = async (providerId: string) => {
    setLoadingProvider(providerId);
    await new Promise((r) => setTimeout(r, 800));
    setLoadingProvider(null);
    showToast(`${providerId.charAt(0).toUpperCase() + providerId.slice(1)}${t.landing.errors.socialComingSoon}`, 'error');
  };

  const validateEmail = () => {
    const e: Record<string, string> = {};
    if (!formData.email) e.email = t.landing.errors.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = t.landing.errors.invalidEmail;
    if (!formData.password) e.password = t.landing.errors.passwordRequired;
    else if (formData.password.length < 6) e.password = t.landing.errors.passwordTooShort;
    if (intent === 'register') {
      if (!formData.name.trim()) e.name = t.landing.errors.nameRequired;
      if (!formData.age) e.age = t.landing.errors.ageRequired;
      else if (parseInt(formData.age) < 18) e.age = t.landing.errors.mustBe18;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setEmailLoading(true);
    try {
      const endpoint = intent === 'register' ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMap: Record<string, string> = {
          'Invalid email or password': t.landing.errors.invalidCredentials,
          'Email already registered': t.landing.errors.emailInUse,
          'Missing required fields': t.landing.errors.missingFields,
          'Password must be at least 6 characters': t.landing.errors.passwordTooShort,
          'Must be 18 or older': t.landing.errors.mustBe18,
          'Internal server error': t.landing.errors.serverError,
        };
        showToast(errMap[data.error] ?? data.error ?? t.landing.errors.serverError, 'error');
        return;
      }
      showToast(intent === 'register' ? t.landing.errors.accountCreated : t.landing.errors.welcomeBack, 'success');
      setTimeout(() => router.push(intent === 'register' ? '/onboarding' : '/dashboard'), 600);
    } catch {
      showToast(t.landing.errors.networkError, 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setPhoneLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setPhoneLoading(false);
    setMode('otp');
  };

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== '') && index === 5) {
      setTimeout(() => router.push('/dashboard'), 400);
    }
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otpDigits];
    paste.split('').forEach((d, i) => { next[i] = d; });
    setOtpDigits(next);
    if (paste.length === 6) setTimeout(() => router.push('/dashboard'), 400);
    else otpRefs.current[paste.length]?.focus();
  };

  const handleDemoLogin = async () => {
    setLoadingProvider('demo');
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? t.landing.errors.demoFailed, 'error');
        return;
      }
      showToast(t.landing.errors.demoActivated, 'success');
      setTimeout(() => router.push('/dashboard'), 500);
    } catch {
      router.push('/dashboard');
    } finally {
      setLoadingProvider(null);
    }
  };

  const maskedPhone = `${countryCode.code} ${phoneNumber.slice(0, 3)}••••${phoneNumber.slice(-2)}`;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d0b1a 0%, #100d22 40%, #130b1e 100%)' }}>

      {/* Animated mesh background */}
      <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute top-[-15%] right-[-15%] w-[70vw] h-[70vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.5) 0%, transparent 70%)' }} />
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }} transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[-10%] left-[-20%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244,63,142,0.4) 0%, transparent 70%)' }} />
      <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.1, 0.16, 0.1] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 4 }}
        className="absolute top-[30%] left-[10%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }} />

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast toast={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ═══════════════════ LANDING ═══════════════════ */}
        {mode === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            className="flex flex-col min-h-screen px-6 pt-14 pb-10"
          >
            {/* Logo */}
            <motion.div initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06 }}
              className="flex flex-col items-center mb-8">
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full blur-3xl scale-[2] pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.35) 0%, transparent 70%)' }} />
                <motion.div animate={{ scale: [1, 1.04, 1], rotate: [0, 1, 0, -1, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
                  <AuraLogomark size={84} animate />
                </motion.div>
              </div>
              <h1 className="text-[52px] font-black tracking-tight leading-none mb-2 font-display"
                style={{ background: 'linear-gradient(135deg, #e879f9 0%, #f9a8d4 45%, #fb7185 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                aura
              </h1>
              <p className="text-white/35 text-xs font-semibold tracking-[0.25em] uppercase">{t.landing.tagline}</p>
            </motion.div>

            {/* Floating avatar gallery */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
              className="relative flex justify-center mb-9">
              <div className="relative w-[260px] h-44">
                {FLOATING_SEEDS.map((seed, i) => {
                  const positions = [{ x: 22, y: 4 }, { x: 88, y: 10 }, { x: 154, y: 2 }, { x: 4, y: 62 }, { x: 116, y: 68 }, { x: 188, y: 56 }];
                  const sizes = [54, 46, 58, 46, 54, 46];
                  const delays = [0, 0.4, 0.8, 0.2, 0.6, 1.0];
                  return (
                    <motion.div key={seed}
                      className="absolute rounded-2xl overflow-hidden shadow-xl"
                      style={{ left: positions[i].x, top: positions[i].y, width: sizes[i], height: sizes[i], border: '2px solid rgba(196,132,252,0.25)' }}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 3.8 + i * 0.25, delay: delays[i], ease: 'easeInOut' }}
                    >
                      <img src={`https://picsum.photos/seed/${seed}/120/120`} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                  );
                })}
                {/* Center pulse */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="w-11 h-11 rounded-full gradient-brand glow-button flex items-center justify-center"
                  >
                    <Sparkles size={18} className="text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              className="flex gap-3 mb-8">
              {stats.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22 + i * 0.06 }}
                  className="flex-1 rounded-2xl px-3 py-3.5 text-center"
                  style={{ background: 'rgba(255,255,255,0.045)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-lg mb-0.5">{s.emoji}</p>
                  <p className="font-black text-base leading-none mb-0.5"
                    style={{ background: 'linear-gradient(135deg, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {s.value}
                  </p>
                  <p className="text-white/30 text-[10px] font-medium">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Feature pills */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex gap-2 flex-wrap justify-center mb-7">
              {t.landing.features.map((f) => (
                <span key={f} className="text-[11px] font-semibold text-white/45 bg-white/5 border border-white/8 px-3 py-1 rounded-full">
                  {f}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
              className="space-y-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => goAuth('register')}
                className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-base glow-button flex items-center justify-center gap-2 shadow-lg">
                {t.landing.createAccount} <ArrowRight size={17} />
              </motion.button>
              <button onClick={() => goAuth('login')}
                className="w-full text-white font-semibold py-3.5 rounded-2xl text-sm transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {t.landing.signIn}
              </button>
              <motion.button
                onClick={handleDemoLogin}
                disabled={loadingProvider === 'demo'}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-white/40 text-sm hover:text-white/65 transition-colors disabled:opacity-50">
                {loadingProvider === 'demo'
                  ? <><Spinner size={14} /> {t.landing.demoLoading}</>
                  : <><Sparkles size={14} className="text-purple-400" /> {t.landing.tryDemo}</>}
              </motion.button>
            </motion.div>

            <p className="text-white/15 text-[10px] text-center mt-6 leading-relaxed">
              {t.landing.ageDisclaimer}
            </p>
          </motion.div>
        )}

        {/* ═══════════════════ AUTH OPTIONS ═══════════════════ */}
        {mode === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-10">
            <button onClick={() => setMode('landing')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 w-fit transition-colors">
              <ArrowLeft size={15} /> Zurück
            </button>

            <div className="mb-8">
              <AuraLogomark size={36} />
              <h2 className="text-3xl font-black text-white mt-4 mb-1.5 font-display">
                {intent === 'register' ? 'Jetzt mitmachen' : 'Willkommen zurück'}
              </h2>
              <p className="text-white/35 text-sm">
                {intent === 'register' ? 'Erstelle dein kostenloses Konto' : 'Melde dich an, um fortzufahren'}
              </p>
            </div>

            {/* Social — 2×2 grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {SOCIAL_PROVIDERS.map((p) => (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSocial(p.id)}
                  disabled={loadingProvider !== null}
                  className={`${p.bg} ${p.text} font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2.5 border ${p.border} transition-opacity disabled:opacity-50`}
                >
                  {loadingProvider === p.id ? <Spinner size={16} dark={p.id === 'google'} /> : <p.icon />}
                  <span>{loadingProvider === p.id ? '…' : p.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-white/25 text-xs font-medium">oder weiter mit</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Email + Phone */}
            <div className="space-y-3 mb-6">
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => setMode('email')}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-3 transition-all hover:border-purple-500/40"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <Mail size={17} className="text-purple-400" />
                Weiter mit E-Mail
              </motion.button>
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => setMode('phone')}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-3 transition-all hover:border-pink-500/40"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <Phone size={17} className="text-pink-400" />
                Weiter mit Telefonnummer
              </motion.button>
            </div>

            <div className="text-center">
              <span className="text-white/30 text-sm">{intent === 'login' ? 'Neu hier? ' : 'Bereits registriert? '}</span>
              <button onClick={() => setIntent(intent === 'login' ? 'register' : 'login')}
                className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
                {intent === 'login' ? 'Konto erstellen' : 'Anmelden'}
              </button>
            </div>

            <p className="text-white/15 text-[10px] text-center mt-8">Nur ab 18 Jahren · AGB & Datenschutz</p>
          </motion.div>
        )}

        {/* ═══════════════════ EMAIL FORM ═══════════════════ */}
        {mode === 'email' && (
          <motion.div key="email" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-10">
            <button onClick={() => setMode('auth')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 w-fit transition-colors">
              <ArrowLeft size={15} /> Zurück
            </button>

            <div className="mb-7">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #f43f8e)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                <Mail size={22} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-1.5 font-display">
                {intent === 'login' ? 'Anmelden' : 'Konto erstellen'}
              </h2>
              <p className="text-white/35 text-sm">
                {intent === 'login' ? 'Gib deine Anmeldedaten ein' : 'Füll deine Daten aus, um loszulegen'}
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="flex-1 space-y-4">
              {intent === 'register' && (
                <>
                  <Field label="Anzeigename" error={errors.name}>
                    <input type="text" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Wie sollen wir dich nennen?"
                      className={INPUT_CLS} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Alter" error={errors.age}>
                      <input type="number" value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="18+" min="18" max="99"
                        className={INPUT_CLS} />
                    </Field>
                    <Field label="Ich bin">
                      <select value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className={INPUT_CLS}>
                        <option value="female" className="bg-[#1a1730]">Frau</option>
                        <option value="male" className="bg-[#1a1730]">Mann</option>
                        <option value="non-binary" className="bg-[#1a1730]">Non-binär</option>
                        <option value="other" className="bg-[#1a1730]">Anderes</option>
                      </select>
                    </Field>
                  </div>
                </>
              )}

              <Field label="E-Mail" error={errors.email}>
                <input type="email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="deine@email.de"
                  autoComplete="email"
                  className={INPUT_CLS} />
              </Field>

              <Field label="Passwort" error={errors.password}>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    autoComplete={intent === 'login' ? 'current-password' : 'new-password'}
                    className={INPUT_CLS + ' pr-12'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors p-1">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              {intent === 'login' && (
                <div className="text-right -mt-1">
                  <button type="button" className="text-purple-400/65 text-xs hover:text-purple-300 transition-colors">
                    Passwort vergessen?
                  </button>
                </div>
              )}

              <div className="pt-1">
                <motion.button type="submit" disabled={emailLoading} whileTap={{ scale: 0.97 }}
                  className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-base glow-button disabled:opacity-60 flex items-center justify-center gap-2.5 shadow-lg">
                  {emailLoading
                    ? <><Spinner /> {intent === 'login' ? 'Anmelden…' : 'Konto wird erstellt…'}</>
                    : <>{intent === 'login' ? 'Anmelden' : 'Konto erstellen'} <ArrowRight size={17} /></>}
                </motion.button>
              </div>

              <div className="text-center pt-1">
                <span className="text-white/30 text-sm">{intent === 'login' ? 'Kein Konto? ' : 'Bereits registriert? '}</span>
                <button type="button"
                  onClick={() => { setIntent(intent === 'login' ? 'register' : 'login'); setErrors({}); }}
                  className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
                  {intent === 'login' ? 'Kostenlos registrieren' : 'Anmelden'}
                </button>
              </div>

              {/* Demo hint */}
              <div className="text-center pt-2">
                <button type="button" onClick={handleDemoLogin}
                  disabled={loadingProvider === 'demo'}
                  className="text-white/22 text-xs hover:text-white/40 transition-colors">
                  Demo testen: demo@aura.app / demo123
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ═══════════════════ PHONE ═══════════════════ */}
        {mode === 'phone' && (
          <motion.div key="phone" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-10">
            <button onClick={() => setMode('auth')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 w-fit transition-colors">
              <ArrowLeft size={15} /> Zurück
            </button>

            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #ec4899, #f43f8e)', boxShadow: '0 0 20px rgba(236,72,153,0.4)' }}>
                <Phone size={22} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-1.5 font-display">Deine Nummer</h2>
              <p className="text-white/35 text-sm">Wir senden dir einen 6-stelligen Code per SMS</p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="flex-1 space-y-5">
              {/* Country picker */}
              <div className="relative">
                <label className="block text-white/45 text-[11px] font-bold uppercase tracking-widest mb-1.5">Land</label>
                <button type="button" onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="w-full py-3.5 rounded-xl px-4 text-white text-sm flex items-center justify-between transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <span className="flex items-center gap-2.5">
                    <span className="text-xl">{countryCode.flag}</span>
                    <span className="text-white/70">{countryCode.name}</span>
                    <span className="text-purple-400 font-semibold">{countryCode.code}</span>
                  </span>
                  <ChevronDown size={16} className={`text-white/30 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showCountryPicker && (
                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      className="absolute top-full left-0 right-0 z-20 mt-1.5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl max-h-52 overflow-y-auto"
                      style={{ background: 'rgba(20,16,40,0.95)', backdropFilter: 'blur(16px)' }}>
                      {COUNTRY_CODES.map((c) => (
                        <button key={c.code} type="button" onClick={() => { setCountryCode(c); setShowCountryPicker(false); }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/8 transition-colors text-left">
                          <span className="text-xl">{c.flag}</span>
                          <span className="text-white text-sm flex-1">{c.name}</span>
                          <span className="text-purple-400 text-sm font-semibold">{c.code}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-white/45 text-[11px] font-bold uppercase tracking-widest mb-1.5">Telefonnummer</label>
                <div className="flex gap-2">
                  <div className="flex-shrink-0 px-3.5 py-3.5 rounded-xl text-purple-400 font-semibold text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    {countryCode.code}
                  </div>
                  <input type="tel" value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="123 456 7890" inputMode="numeric"
                    className={INPUT_CLS + ' tracking-widest flex-1'} />
                </div>
              </div>

              <p className="text-white/25 text-xs">Standard-SMS-Tarife können anfallen. Deine Nummer wird nicht weitergegeben.</p>

              <motion.button type="submit" disabled={phoneLoading || phoneNumber.length < 6} whileTap={{ scale: 0.97 }}
                className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-base glow-button disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-lg">
                {phoneLoading
                  ? <><Spinner /> Code wird gesendet…</>
                  : <>Bestätigungscode senden <ArrowRight size={17} /></>}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* ═══════════════════ OTP ═══════════════════ */}
        {mode === 'otp' && (
          <motion.div key="otp" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-10">
            <button onClick={() => setMode('phone')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 w-fit transition-colors">
              <ArrowLeft size={15} /> Zurück
            </button>

            <div className="mb-10 text-center">
              <motion.div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 mx-auto"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#f43f8e)', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}
                animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                <Phone size={30} className="text-white" />
              </motion.div>
              <h2 className="text-3xl font-black text-white mb-2 font-display">Code eingeben</h2>
              <p className="text-white/35 text-sm">
                Gesendet an <span className="text-white/65 font-semibold">{maskedPhone}</span>
              </p>
            </div>

            {/* OTP inputs */}
            <div className="flex gap-3 justify-center mb-6" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-[58px] rounded-2xl text-center text-white text-2xl font-black focus:outline-none transition-all"
                  style={{
                    background: digit ? 'rgba(124,58,237,0.22)' : 'rgba(255,255,255,0.055)',
                    border: digit ? '2px solid rgba(196,132,252,0.65)' : '2px solid rgba(255,255,255,0.1)',
                    boxShadow: digit ? '0 0 14px rgba(196,132,252,0.25)' : 'none',
                  }}
                />
              ))}
            </div>

            <AnimatePresence>
              {otpDigits.every(d => d !== '') && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 text-purple-400 text-sm font-semibold mb-4">
                  <Spinner size={16} /> Wird überprüft…
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mb-8">
              {canResend ? (
                <button onClick={() => { setOtpDigits(['', '', '', '', '', '']); setMode('phone'); }}
                  className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
                  Code erneut senden
                </button>
              ) : (
                <p className="text-white/30 text-sm">
                  Erneut senden in <span className="text-white/55 font-bold tabular-nums">{otpCountdown}s</span>
                </p>
              )}
            </div>

            <p className="text-white/18 text-xs text-center">
              Mit der Bestätigung erklärst du, dass du mindestens 18 Jahre alt bist.
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
