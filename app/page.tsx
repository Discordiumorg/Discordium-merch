'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Phone, Mail, ChevronDown } from 'lucide-react';
import { AuraLogomark } from '@/components/AuraLogo';

type AuthMode = 'landing' | 'auth' | 'email' | 'phone' | 'otp';
type AuthIntent = 'login' | 'register';

// ─── SVG Provider Icons ──────────────────────────────────────────────────────

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

// ─── Country codes ───────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+1',  flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+351',flag: '🇵🇹', name: 'Portugal' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
];

const SOCIAL_PROVIDERS = [
  { id: 'google',   label: 'Continue with Google',   icon: GoogleIcon,   bg: 'bg-white', text: 'text-gray-800', border: 'border-white/20' },
  { id: 'facebook', label: 'Continue with Facebook', icon: FacebookIcon, bg: 'bg-[#1877F2]', text: 'text-white', border: 'border-transparent' },
  { id: 'x',        label: 'Continue with X',        icon: XIcon,        bg: 'bg-black', text: 'text-white', border: 'border-white/10' },
  { id: 'apple',    label: 'Continue with Apple',    icon: AppleIcon,    bg: 'bg-[#050505]', text: 'text-white', border: 'border-white/10' },
];

const STATS = [
  { value: '2.4M+', label: 'Users' },
  { value: '840K', label: 'Matches' },
  { value: '4.9★', label: 'Rating' },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('landing');
  const [intent, setIntent] = useState<AuthIntent>('register');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // Email form
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', age: '', gender: 'male' });
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

  // Social provider login (mock)
  const handleSocial = async (providerId: string) => {
    setLoadingProvider(providerId);
    await new Promise((r) => setTimeout(r, 1400));
    setLoadingProvider(null);
    router.push('/dashboard');
  };

  // Email submit
  const validateEmail = () => {
    const e: Record<string, string> = {};
    if (!formData.email) e.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password required';
    else if (formData.password.length < 6) e.password = 'Min. 6 characters';
    if (intent === 'register') {
      if (!formData.name) e.name = 'Name required';
      if (!formData.age) e.age = 'Age required';
      else if (parseInt(formData.age) < 18) e.age = 'Must be 18+';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setEmailLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setEmailLoading(false);
    router.push('/dashboard');
  };

  // Phone submit
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setPhoneLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setPhoneLoading(false);
    setMode('otp');
  };

  // OTP input handling
  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
    // Auto-verify when all filled
    if (next.every((d) => d !== '') && index === 5) {
      setTimeout(() => router.push('/dashboard'), 400);
    }
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
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
    await new Promise((r) => setTimeout(r, 700));
    router.push('/dashboard');
  };

  const maskedPhone = `${countryCode.code} ${phoneNumber.slice(0, 3)}••••${phoneNumber.slice(-2)}`;

  return (
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-100px] right-[-80px] w-96 h-96 rounded-full blur-[90px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.22) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[10%] left-[-80px] w-72 h-72 rounded-full blur-[70px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244,63,142,0.18) 0%, transparent 70%)' }} />

      <AnimatePresence mode="wait">

        {/* ════════════════ LANDING ════════════════ */}
        {mode === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            className="flex flex-col min-h-screen px-6 pt-14 pb-10"
          >
            {/* Logo */}
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full blur-2xl scale-150 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)' }} />
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                  <AuraLogomark size={88} animate />
                </motion.div>
              </div>
              <h1 className="text-5xl font-black tracking-tight mb-2"
                style={{ fontFamily: 'Syne,Inter,sans-serif', background: 'linear-gradient(135deg,#e879f9 0%,#f9a8d4 45%,#fb7185 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                aura
              </h1>
              <p className="text-white/45 text-sm font-medium tracking-widest uppercase">Feel the Connection</p>
            </motion.div>

            {/* Floating avatars */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}
              className="relative flex justify-center mb-8"
            >
              <div className="relative w-64 h-40">
                {['aura1','aura2','aura3','aura4','aura5','aura6'].map((seed, i) => {
                  const positions = [{x:20,y:0},{x:80,y:8},{x:140,y:0},{x:0,y:55},{x:110,y:60},{x:180,y:50}];
                  const sizes = [52,44,56,44,52,44];
                  return (
                    <motion.div key={seed} className="absolute rounded-2xl overflow-hidden shadow-2xl"
                      style={{ left: positions[i].x, top: positions[i].y, width: sizes[i], height: sizes[i], border: '2px solid rgba(196,132,252,0.3)' }}
                      animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3.5+i*0.3, delay: i*0.15, ease: 'easeInOut' }}
                    >
                      <img src={`https://picsum.photos/seed/${seed}/100/100`} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                  );
                })}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.div animate={{ scale:[1,1.15,1], opacity:[0.7,1,0.7] }} transition={{ repeat:Infinity, duration:2 }}
                    className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center glow-button">
                    <span className="text-white text-lg">✦</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ y:16, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.26 }}
              className="flex gap-3 mb-7"
            >
              {STATS.map((s) => (
                <div key={s.label} className="card-glass rounded-2xl px-4 py-3 text-center flex-1">
                  <p className="gradient-text font-black text-lg leading-none mb-0.5">{s.value}</p>
                  <p className="text-white/35 text-[10px] font-medium">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div initial={{ y:16, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.34 }}
              className="space-y-3"
            >
              <motion.button whileTap={{ scale:0.97 }} onClick={() => goAuth('register')}
                className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-base glow-button flex items-center justify-center gap-2">
                Create Account <ArrowRight size={16} />
              </motion.button>
              <button onClick={() => goAuth('login')}
                className="w-full bg-white/8 border border-white/15 text-white font-semibold py-3.5 rounded-2xl text-base hover:bg-white/12 transition-colors">
                Sign In
              </button>
              <button onClick={handleDemoLogin} disabled={loadingProvider === 'demo'}
                className="w-full text-white/35 text-sm py-2 hover:text-white/55 transition-colors">
                {loadingProvider === 'demo' ? 'Loading…' : '✦ Try Demo — no account needed'}
              </button>
            </motion.div>
            <p className="text-white/18 text-[10px] text-center mt-6">18+ only · By continuing you agree to our Terms & Privacy Policy</p>
          </motion.div>
        )}

        {/* ════════════════ AUTH OPTIONS ════════════════ */}
        {mode === 'auth' && (
          <motion.div key="auth" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-10"
          >
            <button onClick={() => setMode('landing')} className="flex items-center gap-2 text-white/45 hover:text-white text-sm mb-8 w-fit transition-colors">
              <ArrowLeft size={16} /> Back
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <AuraLogomark size={36} />
              <span className="text-2xl font-black"
                style={{ fontFamily:'Syne,Inter,sans-serif', background:'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                aura
              </span>
            </div>
            <h2 className="text-3xl font-black text-white mb-1">
              {intent === 'register' ? 'Create account ✦' : 'Welcome back ✦'}
            </h2>
            <p className="text-white/40 text-sm mb-8">
              {intent === 'register' ? 'Choose how you want to sign up' : 'Choose how you want to sign in'}
            </p>

            {/* Social providers */}
            <div className="space-y-3 mb-6">
              {SOCIAL_PROVIDERS.map((p) => (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocial(p.id)}
                  disabled={loadingProvider !== null}
                  className={`w-full ${p.bg} ${p.text} font-semibold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-3 border ${p.border} transition-opacity disabled:opacity-60`}
                >
                  {loadingProvider === p.id ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className={`w-5 h-5 border-2 rounded-full ${p.id === 'google' ? 'border-gray-300 border-t-gray-700' : 'border-white/30 border-t-white'}`} />
                  ) : (
                    <p.icon />
                  )}
                  {loadingProvider === p.id ? 'Connecting…' : p.label}
                </motion.button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs font-medium">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email + Phone */}
            <div className="space-y-3">
              <motion.button whileTap={{ scale:0.98 }} onClick={() => setMode('email')}
                className="w-full bg-white/8 border border-white/15 text-white font-semibold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-3 hover:bg-white/12 transition-colors">
                <Mail size={18} className="text-purple-400" />
                Continue with Email
              </motion.button>
              <motion.button whileTap={{ scale:0.98 }} onClick={() => setMode('phone')}
                className="w-full bg-white/8 border border-white/15 text-white font-semibold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-3 hover:bg-white/12 transition-colors">
                <Phone size={18} className="text-pink-400" />
                Continue with Phone
              </motion.button>
            </div>

            <p className="text-white/20 text-[10px] text-center mt-8">
              18+ only · Terms & Privacy Policy apply
            </p>
          </motion.div>
        )}

        {/* ════════════════ EMAIL FORM ════════════════ */}
        {mode === 'email' && (
          <motion.div key="email" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-10"
          >
            <button onClick={() => setMode('auth')} className="flex items-center gap-2 text-white/45 hover:text-white text-sm mb-8 w-fit transition-colors">
              <ArrowLeft size={16} /> Back
            </button>
            <div className="mb-8">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background:'linear-gradient(135deg,#7c3aed,#f43f8e)' }}>
                <Mail size={20} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-white">
                {intent === 'login' ? 'Sign in ✦' : 'Join Aura ✦'}
              </h2>
              <p className="text-white/40 mt-1.5 text-sm">
                {intent === 'login' ? 'Enter your email and password' : 'Create your account with email'}
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="flex-1 space-y-4">
              {intent === 'register' && (
                <>
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Display Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name:e.target.value})}
                      placeholder="How should we call you?"
                      className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 text-white placeholder:text-white/22 focus:border-purple-500/60 transition-colors text-sm" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Age</label>
                      <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age:e.target.value})}
                        placeholder="Your age" min="18" max="99"
                        className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 text-white placeholder:text-white/22 focus:border-purple-500/60 transition-colors text-sm" />
                      {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">I am</label>
                      <select value={formData.gender} onChange={(e) => setFormData({...formData, gender:e.target.value})}
                        className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 text-white focus:border-purple-500/60 transition-colors text-sm">
                        <option value="male" className="bg-brand-card">Man</option>
                        <option value="female" className="bg-brand-card">Woman</option>
                        <option value="non-binary" className="bg-brand-card">Non-binary</option>
                        <option value="other" className="bg-brand-card">Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email:e.target.value})}
                  placeholder="your@email.com"
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 text-white placeholder:text-white/22 focus:border-purple-500/60 transition-colors text-sm" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({...formData, password:e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-white/22 focus:border-purple-500/60 transition-colors text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              {intent === 'login' && (
                <div className="text-right">
                  <button type="button" className="text-purple-400/70 text-xs hover:text-purple-300 transition-colors">Forgot password?</button>
                </div>
              )}
              <div className="pt-2">
                <motion.button type="submit" disabled={emailLoading} whileTap={{ scale:0.98 }}
                  className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-base glow-button disabled:opacity-60 flex items-center justify-center gap-2">
                  {emailLoading ? (
                    <><motion.div animate={{ rotate:360 }} transition={{ duration:0.9, repeat:Infinity, ease:'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    {intent === 'login' ? 'Signing in…' : 'Creating…'}</>
                  ) : (intent === 'login' ? 'Sign In' : 'Create Account')}
                </motion.button>
              </div>
              <div className="text-center">
                <span className="text-white/35 text-sm">{intent === 'login' ? "Don't have an account? " : 'Already have an account? '}</span>
                <button type="button" onClick={() => setIntent(intent === 'login' ? 'register' : 'login')}
                  className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
                  {intent === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ════════════════ PHONE ENTRY ════════════════ */}
        {mode === 'phone' && (
          <motion.div key="phone" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-10"
          >
            <button onClick={() => setMode('auth')} className="flex items-center gap-2 text-white/45 hover:text-white text-sm mb-8 w-fit transition-colors">
              <ArrowLeft size={16}/> Back
            </button>
            <div className="mb-8">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background:'linear-gradient(135deg,#ec4899,#f43f8e)' }}>
                <Phone size={20} className="text-white"/>
              </div>
              <h2 className="text-3xl font-black text-white">Your number ✦</h2>
              <p className="text-white/40 mt-1.5 text-sm">We'll send a verification code via SMS</p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="flex-1 space-y-5">
              {/* Country code picker */}
              <div className="relative">
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Country</label>
                <button type="button" onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 text-white flex items-center justify-between text-sm hover:border-white/20 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{countryCode.flag}</span>
                    <span className="text-white/70">{countryCode.name}</span>
                    <span className="text-purple-400 font-semibold">{countryCode.code}</span>
                  </span>
                  <ChevronDown size={16} className={`text-white/30 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`}/>
                </button>

                <AnimatePresence>
                  {showCountryPicker && (
                    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                      className="absolute top-full left-0 right-0 z-20 mt-2 card-glass rounded-2xl border border-white/15 overflow-hidden shadow-2xl max-h-56 overflow-y-auto">
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

              {/* Phone input */}
              <div>
                <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">Phone Number</label>
                <div className="flex gap-3">
                  <div className="px-3.5 py-3.5 bg-white/8 border border-white/12 rounded-xl text-purple-400 font-semibold text-sm whitespace-nowrap">
                    {countryCode.code}
                  </div>
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g,''))}
                    placeholder="123 456 7890" inputMode="numeric"
                    className="flex-1 bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 text-white placeholder:text-white/22 focus:border-purple-500/60 transition-colors text-sm tracking-wider" />
                </div>
              </div>

              <p className="text-white/30 text-xs">Standard SMS rates may apply. We will never share your number.</p>

              <motion.button type="submit" disabled={phoneLoading || phoneNumber.length < 6} whileTap={{ scale:0.98 }}
                className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-base glow-button disabled:opacity-50 flex items-center justify-center gap-2">
                {phoneLoading ? (
                  <><motion.div animate={{ rotate:360 }} transition={{ duration:0.9, repeat:Infinity, ease:'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"/>Sending code…</>
                ) : 'Send Verification Code'}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* ════════════════ OTP ════════════════ */}
        {mode === 'otp' && (
          <motion.div key="otp" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-10"
          >
            <button onClick={() => setMode('phone')} className="flex items-center gap-2 text-white/45 hover:text-white text-sm mb-8 w-fit transition-colors">
              <ArrowLeft size={16}/> Back
            </button>

            <div className="mb-10">
              <motion.div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5 mx-auto"
                style={{ background:'linear-gradient(135deg,#7c3aed,#f43f8e)', boxShadow:'0 0 32px rgba(124,58,237,0.5)' }}
                animate={{ scale:[1,1.05,1] }} transition={{ repeat:Infinity, duration:2.5 }}>
                <Phone size={26} className="text-white"/>
              </motion.div>
              <h2 className="text-3xl font-black text-white text-center">Enter code ✦</h2>
              <p className="text-white/40 mt-2 text-sm text-center">
                Sent to <span className="text-white/70 font-semibold">{maskedPhone}</span>
              </p>
            </div>

            {/* 6-digit OTP inputs */}
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
                  className="w-12 h-14 rounded-2xl text-center text-white text-xl font-black transition-all"
                  style={{
                    background: digit ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)',
                    border: digit ? '2px solid rgba(196,132,252,0.6)' : '2px solid rgba(255,255,255,0.12)',
                    boxShadow: digit ? '0 0 12px rgba(196,132,252,0.3)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Auto-verify indication */}
            {otpDigits.every(d => d !== '') && (
              <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                className="flex items-center justify-center gap-2 text-purple-400 text-sm font-semibold mb-4">
                <motion.div animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
                  className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full"/>
                Verifying…
              </motion.div>
            )}

            {/* Resend */}
            <div className="text-center mb-8">
              {canResend ? (
                <button onClick={() => { setOtpDigits(['','','','','','']); setMode('phone'); }}
                  className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
                  Resend code
                </button>
              ) : (
                <p className="text-white/30 text-sm">
                  Resend in <span className="text-white/60 font-semibold tabular-nums">{otpCountdown}s</span>
                </p>
              )}
            </div>

            <p className="text-white/20 text-xs text-center">
              By verifying, you confirm you are 18 years or older.
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
