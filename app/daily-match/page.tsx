'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Target, Sparkles, Lock, Star, Send, X, Clock } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { mockUsers } from '@/lib/mockData';

const DAILY_MATCH = mockUsers[0]; // Sophie
const COMPAT_SCORE = 94;
const MATCH_REASONS = [
  { icon: '🎯', label: 'Gleiches Beziehungsziel', detail: 'Beide suchen etwas Ernstes' },
  { icon: '🌍', label: 'Gleiche Stadt', detail: 'Beide in Berlin' },
  { icon: '☕', label: 'Gemeinsame Interessen', detail: 'Kaffee, Fotografie, Reisen' },
  { icon: '📅', label: 'Ähnliches Alter', detail: 'Nur 1 Jahr Unterschied' },
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
  const [declined, setDeclined] = useState(false);

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
            Tages-Match ✦
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            aktualisiert in {pad(countdown.h)}h {pad(countdown.m)}m
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
            <h3 className="text-sm font-semibold text-white/80">Warum ihr passt</h3>
          </div>
          <div className="space-y-2">
            {MATCH_REASONS.map((r, index) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.15, type: 'spring', stiffness: 240, damping: 18 }}
                className="flex items-center gap-3 py-2 px-3 rounded-xl"
                style={{ background: 'rgba(147,51,234,0.06)', border: '1px solid rgba(147,51,234,0.12)' }}
              >
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2 + index * 0.15, type: 'spring', stiffness: 320, damping: 14 }}
                  className="text-xl w-8 text-center flex-shrink-0"
                >
                  {r.icon}
                </motion.span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{r.label}</p>
                  <p className="text-xs text-white/50 truncate">{r.detail}</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.15, type: 'spring', stiffness: 400, damping: 16 }}
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(74,222,128,0.2)' }}
                >
                  <span className="text-[10px] text-green-400 font-bold">✓</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Countdown banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: 'rgba(147,51,234,0.12)', border: '1px solid rgba(147,51,234,0.25)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(147,51,234,0.2)' }}
            >
              <Clock size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium">Nächstes Match in</p>
              <p className="text-2xl font-bold text-white font-mono tracking-wider">
                {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Sparkles size={28} className="text-purple-400" />
          </motion.div>
        </motion.div>

        {/* CTAs — Accept / Decline */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          {/* Accept / Nachricht senden */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 40px rgba(244,63,142,0.6)',
              y: -2,
            }}
            whileTap={{ scale: 0.92, boxShadow: '0 0 20px rgba(244,63,142,0.3)' }}
            transition={{ type: 'spring', stiffness: 420, damping: 15 }}
            onClick={() => setShowMessageSheet(true)}
            className="py-4 rounded-2xl font-semibold text-white gradient-brand glow-button flex items-center justify-center gap-2 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0"
              whileHover={{ opacity: 1 }}
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }}
            />
            <Send size={16} />
            <span>Annehmen</span>
          </motion.button>

          {/* Ablehnen */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(239,68,68,0.35)',
              y: -2,
            }}
            whileTap={{ scale: 0.92, rotate: [-4, 4, 0] }}
            transition={{ type: 'spring', stiffness: 420, damping: 15 }}
            onClick={() => setDeclined(!declined)}
            className="py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 relative overflow-hidden"
            style={{
              background: declined ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
              border: `2px solid ${declined ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'}`,
              color: declined ? '#f87171' : 'rgba(255,255,255,0.6)',
            }}
          >
            <motion.div
              animate={declined ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <X size={16} />
            </motion.div>
            <span>{declined ? 'Abgelehnt' : 'Ablehnen'}</span>
          </motion.button>
        </div>

        {/* Super Like */}
        <motion.button
          whileHover={{
            scale: 1.03,
            boxShadow: superLiked ? '0 0 40px rgba(234,179,8,0.7)' : '0 0 25px rgba(234,179,8,0.4)',
            y: -1,
          }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 420, damping: 15 }}
          onClick={() => setSuperLiked(true)}
          className="w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 relative overflow-hidden"
          style={{
            background: superLiked ? 'rgba(234,179,8,0.2)' : 'rgba(234,179,8,0.08)',
            border: `2px solid ${superLiked ? 'rgba(234,179,8,0.6)' : 'rgba(234,179,8,0.3)'}`,
            color: '#facc15',
          }}
        >
          <motion.div
            animate={superLiked ? { rotate: [0, -15, 15, -8, 8, 0], scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.6 }}
          >
            <Star size={18} className={superLiked ? 'fill-yellow-400' : ''} />
          </motion.div>
          {superLiked ? '⭐ Super Geliked!' : 'Super Like senden'}
        </motion.button>
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
                    Nachricht gesendet!
                  </h3>
                  <p className="text-white/50 text-sm text-center">
                    {DAILY_MATCH.name} wird benachrichtigt. Drück die Daumen! 🤞
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
                      {DAILY_MATCH.name} schreiben 💌
                    </h3>
                    <button onClick={() => setShowMessageSheet(false)}>
                      <X size={20} className="text-white/50" />
                    </button>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Schreib etwas an ${DAILY_MATCH.name}…`}
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
                    Erste Nachricht senden
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
          <p className="text-white/50 text-sm">Komm morgen zurück für dein nächstes Match</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
