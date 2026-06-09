'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, Eye, EyeOff, Sparkles, Users, MessageCircle, Star } from 'lucide-react';

type AuthMode = 'landing' | 'login' | 'register';

const features = [
  { icon: Heart, label: 'Smart Matching', desc: 'Swipe-based algorithm finds your perfect match' },
  { icon: Users, label: 'Browse Profiles', desc: 'Grid view to explore who\'s near you' },
  { icon: MessageCircle, label: 'Real Connections', desc: 'Chat with your matches instantly' },
  { icon: Star, label: 'Profile Visitors', desc: 'See who\'s been checking out your profile' },
];

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
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (mode === 'register') {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.age) newErrors.age = 'Age is required';
      else if (parseInt(formData.age) < 18) newErrors.age = 'You must be 18 or older';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Mock auth delay
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push('/dashboard');
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-80px] w-64 h-64 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[-60px] w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {mode === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            {/* Hero */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
              {/* Logo */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="w-20 h-20 gradient-brand rounded-3xl flex items-center justify-center mb-4 mx-auto glow-purple shadow-2xl">
                  <Heart className="text-white" size={40} fill="white" />
                </div>
                <h1 className="text-4xl font-black text-center">
                  <span className="gradient-text">Discordium</span>
                </h1>
                <p className="text-white/60 text-center text-sm mt-1 font-medium tracking-wide uppercase">
                  Find Your Connection
                </p>
              </motion.div>

              {/* Stacked cards preview */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative w-72 h-52 mb-10"
              >
                {[
                  { seed: 'preview3', rotate: '-6deg', z: 0, color: 'from-pink-600/30' },
                  { seed: 'preview2', rotate: '3deg', z: 1, color: 'from-purple-600/30' },
                  { seed: 'preview1', rotate: '0deg', z: 2, color: 'from-violet-600/20' },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      transform: `rotate(${card.rotate})`,
                      zIndex: card.z,
                      backgroundImage: `url(https://picsum.photos/seed/${card.seed}/400/300)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-t ${card.color} to-transparent`} />
                  </div>
                ))}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="flex gap-3 justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-500/80 backdrop-blur flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">✕</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-500/80 backdrop-blur flex items-center justify-center shadow-lg">
                      <Heart size={18} className="text-white" fill="white" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Features grid */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-3 w-full mb-8"
              >
                {features.map((f, i) => (
                  <div key={i} className="card-glass rounded-2xl p-3 text-center">
                    <f.icon className="mx-auto mb-1.5 text-purple-400" size={22} />
                    <p className="text-white text-xs font-semibold">{f.label}</p>
                    <p className="text-white/50 text-[10px] mt-0.5 leading-tight">{f.desc}</p>
                  </div>
                ))}
              </motion.div>

              {/* Age disclaimer */}
              <p className="text-white/30 text-xs text-center mb-6">
                For adults 18+. By continuing you agree to our Terms & Privacy Policy.
              </p>

              {/* CTA buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full space-y-3"
              >
                <button
                  onClick={() => setMode('register')}
                  className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-lg shadow-lg glow-purple hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  Create Account
                </button>
                <button
                  onClick={() => setMode('login')}
                  className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-2xl text-lg hover:bg-white/15 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full text-white/60 text-sm py-2 hover:text-white/80 transition-colors"
                >
                  {loading ? 'Loading...' : 'Try Demo (no account needed)'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {(mode === 'login' || mode === 'register') && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="min-h-screen flex flex-col px-6 pt-12 pb-8"
          >
            {/* Back button */}
            <button
              onClick={() => { setMode('landing'); setErrors({}); }}
              className="text-white/60 hover:text-white flex items-center gap-2 text-sm mb-8 w-fit"
            >
              ← Back
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center mb-4 glow-purple">
                <Heart className="text-white" size={28} fill="white" />
              </div>
              <h2 className="text-3xl font-black text-white">
                {mode === 'login' ? 'Welcome back' : 'Join Discordium'}
              </h2>
              <p className="text-white/50 mt-1">
                {mode === 'login'
                  ? 'Sign in to continue finding your match'
                  : 'Create your profile and start connecting'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="How should we call you?"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-1.5">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="Your age"
                        min="18"
                        max="99"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-1.5">I am</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                <label className="block text-white/70 text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <button type="button" className="text-purple-400 text-sm hover:text-purple-300">
                    Forgot password?
                  </button>
                </div>
              )}

              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-lg shadow-lg glow-purple hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </motion.button>
              </div>

              <div className="text-center pt-2">
                <span className="text-white/50 text-sm">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                </span>
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }}
                  className="text-purple-400 text-sm font-semibold hover:text-purple-300"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="text-white/40 text-xs hover:text-white/60 transition-colors"
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
