'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { AuraLogomark } from '@/components/AuraLogo';

type AuthMode = 'landing' | 'login' | 'register';

const stats = [
  { value: '2.4M+', label: 'Active Users' },
  { value: '840K', label: 'Matches Made' },
  { value: '4.9★', label: 'App Rating' },
];

const previewSeeds = ['aura1', 'aura2', 'aura3', 'aura4', 'aura5', 'aura6'];

export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('landing');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: 'male',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password required';
    else if (formData.password.length < 6) newErrors.password = 'Min. 6 characters';
    if (mode === 'register') {
      if (!formData.name) newErrors.name = 'Name required';
      if (!formData.age) newErrors.age = 'Age required';
      else if (parseInt(formData.age) < 18) newErrors.age = 'Must be 18+';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    router.push('/dashboard');
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Background aura blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-96 h-96 rounded-full blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.22) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[15%] left-[-80px] w-72 h-72 rounded-full blur-[70px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244,63,142,0.18) 0%, transparent 70%)' }} />
      <div className="absolute top-[45%] right-[-40px] w-56 h-56 rounded-full blur-[60px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />

      <AnimatePresence mode="wait">
        {/* ─── Landing ────────────────────────────────── */}
        {mode === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen px-6 pt-14 pb-10"
          >
            {/* Logo + Hero */}
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="flex flex-col items-center mb-8"
            >
              {/* Animated logo mark */}
              <div className="relative mb-5">
                {/* Ambient glow behind logo */}
                <div className="absolute inset-0 rounded-full blur-2xl scale-150 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)' }} />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="relative"
                >
                  <AuraLogomark size={88} animate />
                </motion.div>
              </div>

              <h1
                className="text-5xl font-black tracking-tight mb-2"
                style={{
                  fontFamily: 'Syne, Inter, sans-serif',
                  background: 'linear-gradient(135deg, #e879f9 0%, #f9a8d4 45%, #fb7185 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                aura
              </h1>
              <p className="text-white/50 text-sm font-medium tracking-widest uppercase">
                Feel the Connection
              </p>
            </motion.div>

            {/* Profile photo ring */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18 }}
              className="relative flex justify-center mb-8"
            >
              {/* Floating profile photos in orbit */}
              <div className="relative w-64 h-40">
                {previewSeeds.map((seed, i) => {
                  const positions = [
                    { x: 20, y: 0 }, { x: 80, y: 8 }, { x: 140, y: 0 },
                    { x: 0, y: 55 }, { x: 110, y: 60 }, { x: 180, y: 50 },
                  ];
                  const sizes = [52, 44, 56, 44, 52, 44];
                  const delays = [0, 0.3, 0.6, 0.9, 0.5, 0.2];
                  const pos = positions[i];
                  const sz = sizes[i];
                  return (
                    <motion.div
                      key={seed}
                      className="absolute rounded-2xl overflow-hidden shadow-2xl"
                      style={{
                        left: pos.x,
                        top: pos.y,
                        width: sz,
                        height: sz,
                        border: '2px solid rgba(196,132,252,0.35)',
                      }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.5 + i * 0.3,
                        delay: delays[i],
                        ease: 'easeInOut',
                      }}
                    >
                      <img
                        src={`https://picsum.photos/seed/${seed}/100/100`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {/* gradient overlay */}
                      <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(7,6,15,0.5) 100%)' }} />
                    </motion.div>
                  );
                })}

                {/* Center match indicator */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center shadow-lg glow-button"
                  >
                    <span className="text-white text-lg">✦</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="flex justify-center gap-4 mb-8"
            >
              {stats.map((s, i) => (
                <div key={i} className="card-glass rounded-2xl px-4 py-3 text-center flex-1">
                  <p className="gradient-text font-black text-lg leading-none mb-0.5">{s.value}</p>
                  <p className="text-white/40 text-[10px] font-medium">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-center mb-8"
            >
              <p className="text-white/70 text-base font-medium leading-relaxed">
                Discover people who match your vibe.<br />
                <span className="text-white/40 text-sm">Swipe · Chat · Meet · Connect</span>
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.42 }}
              className="space-y-3"
            >
              <motion.button
                onClick={() => setMode('register')}
                whileTap={{ scale: 0.97 }}
                className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-base shadow-lg glow-button flex items-center justify-center gap-2.5"
              >
                <Sparkles size={18} />
                Create Account
                <ArrowRight size={16} />
              </motion.button>

              <button
                onClick={() => setMode('login')}
                className="w-full bg-white/8 border border-white/15 text-white font-semibold py-3.5 rounded-2xl text-base hover:bg-white/12 transition-colors"
              >
                Sign In
              </button>

              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full text-white/40 text-sm py-2 hover:text-white/60 transition-colors"
              >
                {loading ? 'Loading…' : '✦ Try Demo — no account needed'}
              </button>
            </motion.div>

            <p className="text-white/20 text-[10px] text-center mt-6">
              18+ only · By continuing you agree to our Terms & Privacy Policy
            </p>
          </motion.div>
        )}

        {/* ─── Login / Register ────────────────────────── */}
        {(mode === 'login' || mode === 'register') && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-8"
          >
            <button
              onClick={() => { setMode('landing'); setErrors({}); }}
              className="text-white/50 hover:text-white flex items-center gap-2 text-sm mb-8 w-fit transition-colors"
            >
              ← Back
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <AuraLogomark size={40} />
                <span
                  className="text-2xl font-black"
                  style={{
                    fontFamily: 'Syne, Inter, sans-serif',
                    background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  aura
                </span>
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">
                {mode === 'login' ? 'Welcome back ✦' : 'Join Aura ✦'}
              </h2>
              <p className="text-white/45 mt-2 text-sm">
                {mode === 'login'
                  ? 'Sign in to continue your journey'
                  : 'Create your profile and start connecting'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="How should we call you?"
                      className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-white/25 focus:border-purple-500/70 transition-colors text-sm"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="Your age"
                        min="18"
                        max="99"
                        className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-white/25 focus:border-purple-500/70 transition-colors text-sm"
                      />
                      {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">I am</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 text-white focus:border-purple-500/70 transition-colors text-sm"
                      >
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
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-white/25 focus:border-purple-500/70 transition-colors text-sm"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-white/25 focus:border-purple-500/70 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <button type="button" className="text-purple-400/80 text-xs hover:text-purple-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-base shadow-lg glow-button hover:opacity-92 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                    </>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </motion.button>
              </div>

              <div className="text-center pt-1">
                <span className="text-white/40 text-sm">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                </span>
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }}
                  className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="text-white/30 text-xs hover:text-white/50 transition-colors"
                >
                  Skip — Try Demo Mode
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
