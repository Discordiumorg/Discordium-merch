'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Target, Sparkles, Lock, Star, Send, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { mockUsers } from '@/lib/mockData';

const DAILY_MATCH = mockUsers[0]; // Sophie
const COMPAT_SCORE = 94;
const MATCH_REASONS = [
  { icon: '🎯', label: 'Same relationship goal', detail: 'Both looking for something serious' },
  { icon: '🌍', label: 'Same city', detail: 'Both based in Berlin' },
  { icon: '☕', label: 'Shared interests', detail: 'Coffee, Photography, Travel' },
  { icon: '📅', label: 'Similar age', detail: 'Just 1 year apart' },
];

function getTimeUntilMidnight(): { h: number; m: number; s: number } {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = Math.max(0, midnight.getTime() - now.getTime());
  const totalSecs = Math.floor(diff / 1000);
  return {
    h: Math.floor(totalSecs / 3600),
    m: Math.floor((totalSecs % 3600) / 60),
    s: totalSecs % 60,
  };
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function DailyMatchPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  const [showMessageSheet, setShowMessageSheet] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [superLiked, setSuperLiked] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setCountdown(getTimeUntilMidnight()), 1000);
    return () => clearInterval(iv);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessageSent(true);
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 300 - 150,
      y: Math.random() * -200 - 50,
      color: ['#f43f8e', '#a855f7', '#f97316', '#facc15', '#4ade80'][Math.floor(Math.random() * 5)],
    }));
    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
      setShowMessageSheet(false);
      setMessage('');
    }, 3000);
  };

  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (COMPAT_SCORE / 100) * circumference;

  return (
    <div className="min-h-screen bg-brand-dark pb-safe flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <ChevronLeft size={20} className="text-white/70" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
            Today&apos;s Match ✦
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            refreshes in {pad(countdown.h)}h {pad(countdown.m)}m
          </p>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 space-y-4">
        {/* Profile card */}
        <div className="relative rounded-3xl overflow-hidden" style={{ height: 420 }}>
          <img
            src={DAILY_MATCH.photos[0]}
            alt={DAILY_MATCH.name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(7,6,15,0.95) 0%, transparent 45%)' }}
          />

          {/* Compatibility ring overlay */}
          <div className="absolute top-4 right-4">
            <div className="relative w-20 h-20">
              <svg width="80" height="80" className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <circle
                  cx="40" cy="40" r="38"
                  fill="none"
                  stroke="url(#compatGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
                <defs>
                  <linearGradient id="compatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f8e" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: 'rgba(7,6,15,0.6)', borderRadius: '50%' }}>
                <span className="text-xl font-bold text-white">{COMPAT_SCORE}</span>
                <span className="text-[9px] text-white/60">match</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
                {DAILY_MATCH.name}, {DAILY_MATCH.age}
              </h2>
              {DAILY_MATCH.verified && (
                <span className="text-blue-400 text-lg">✓</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-white/60 text-sm">
              <MapPin size={12} />
              <span>{DAILY_MATCH.location}</span>
              <span className="mx-1">·</span>
              <span>{DAILY_MATCH.job}</span>
            </div>
          </div>
        </div>

        {/* Why you match */}
        <div className="card-glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-white/80">Why you match</h3>
          </div>
          <div className="space-y-2">
            {MATCH_REASONS.map((r) => (
              <div key={r.label} className="flex items-center gap-3 py-1.5">
                <span className="text-xl w-8 text-center">{r.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{r.label}</p>
                  <p className="text-xs text-white/50">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown banner */}
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: 'rgba(147,51,234,0.12)', border: '1px solid rgba(147,51,234,0.25)' }}
        >
          <div>
            <p className="text-xs text-white/50 font-medium">Next match in</p>
            <p className="text-2xl font-bold text-white font-mono">
              {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </p>
          </div>
          <Sparkles size={28} className="text-purple-400" />
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowMessageSheet(true)}
            className="py-4 rounded-2xl font-semibold text-white gradient-brand glow-button flex items-center justify-center gap-2"
          >
            <Send size={16} />
            Send Message
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setSuperLiked(true)}
            className="py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
            style={{
              background: superLiked
                ? 'rgba(234,179,8,0.2)'
                : 'rgba(234,179,8,0.1)',
              border: '2px solid rgba(234,179,8,0.4)',
              color: '#facc15',
            }}
          >
            <Star size={16} className={superLiked ? 'fill-yellow-400' : ''} />
            {superLiked ? 'Super Liked!' : 'Super Like'}
          </motion.button>
        </div>
      </div>

      {/* Message Sheet */}
      <AnimatePresence>
        {showMessageSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => !messageSent && setShowMessageSheet(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 rounded-t-3xl p-6"
              style={{ background: '#1c1635', border: '1px solid rgba(147,51,234,0.25)' }}
            >
              {messageSent ? (
                <div className="flex flex-col items-center py-6 relative overflow-hidden">
                  <AnimatePresence>
                    {particles.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute w-3 h-3 rounded-full pointer-events-none"
                        style={{ background: p.color, top: '50%', left: '50%' }}
                      />
                    ))}
                  </AnimatePresence>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                    className="text-5xl mb-3"
                  >
                    💌
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
                    Message Sent!
                  </h3>
                  <p className="text-white/50 text-sm text-center">
                    {DAILY_MATCH.name} will be notified. Fingers crossed! 🤞
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
                      Message {DAILY_MATCH.name} 💌
                    </h3>
                    <button onClick={() => setShowMessageSheet(false)}>
                      <X size={20} className="text-white/50" />
                    </button>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Say something to ${DAILY_MATCH.name}…`}
                    rows={4}
                    className="w-full rounded-2xl p-4 text-white text-sm resize-none placeholder:text-white/30 mb-4"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="w-full py-4 rounded-2xl font-semibold text-white gradient-brand glow-button disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Send First Message
                  </motion.button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lock overlay (example "already seen" state — hidden for now) */}
      {false && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center"
          style={{ backdropFilter: 'blur(20px)', background: 'rgba(7,6,15,0.6)' }}>
          <Lock size={48} className="text-white/30 mb-4" />
          <p className="text-white/50 text-sm">Come back tomorrow for your next match</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
