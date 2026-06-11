'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Heart, Star, ChevronLeft, Users, MessageSquare, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const SPEED_DATE_PEOPLE = [
  { id: 1, name: 'Sophie', age: 26, job: 'Fotografin', city: 'Berlin', seed: 'sophie1' },
  { id: 2, name: 'Elena', age: 24, job: 'UX Designerin', city: 'München', seed: 'elena1' },
  { id: 3, name: 'Lena', age: 27, job: 'Künstlerin', city: 'Köln', seed: 'lena2' },
  { id: 4, name: 'Julia', age: 31, job: 'Sommelière', city: 'Berlin', seed: 'julia1' },
  { id: 5, name: 'Mia', age: 23, job: 'Tanzlehrerin', city: 'Dresden', seed: 'mia1' },
  { id: 6, name: 'Kai', age: 25, job: 'Softwareentwickler', city: 'Frankfurt', seed: 'kai1' },
];

const ICE_BREAKERS = [
  'Was war dein lustigstes Date-Erlebnis? 😂',
  'Welches Land steht ganz oben auf deiner Bucket-Liste? 🌍',
  'Was ist deine absolutes Lieblingsgericht? 🍝',
  'Podcast, Musik oder Stille beim Autofahren? 🎧',
  'Was würdest du tun, wenn du für einen Tag unsichtbar wärst? 👻',
  'Was bringt dich sofort zum Lachen? 😄',
  'Eher Frühstück oder Mitternachtssnack? 🌙',
  'Was war deine bisher größte Überraschung im Leben? 🎉',
];

const TIMER_SECONDS = 120;

export default function VideoDatePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [matchIds, setMatchIds] = useState<number[]>([]);
  const [showLikedToast, setShowLikedToast] = useState(false);
  const [showMatchOverlay, setShowMatchOverlay] = useState(false);
  const [waitingCount, setWaitingCount] = useState(24);
  const [transitioning, setTransitioning] = useState(false);
  const [currentIceBreaker, setCurrentIceBreaker] = useState(0);
  const [showIceBreaker, setShowIceBreaker] = useState(false);

  const currentPerson = SPEED_DATE_PEOPLE[currentIndex % SPEED_DATE_PEOPLE.length];

  const advanceToNext = useCallback(() => {
    setTransitioning(true);
    setShowIceBreaker(false);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(TIMER_SECONDS);
      setWaitingCount((prev) => Math.max(0, prev - 1));
      setCurrentIceBreaker((prev) => (prev + 1) % ICE_BREAKERS.length);
      setTransitioning(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      advanceToNext();
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, advanceToNext]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleLike = () => {
    if (likedIds.includes(currentPerson.id)) return;
    setLikedIds((prev) => [...prev, currentPerson.id]);
    setShowLikedToast(true);
    setTimeout(() => setShowLikedToast(false), 2000);
    if (Math.random() > 0.5) {
      setMatchIds((prev) => [...prev, currentPerson.id]);
      setTimeout(() => {
        setShowMatchOverlay(true);
        setTimeout(() => setShowMatchOverlay(false), 3000);
      }, 600);
    }
    setTimeout(() => advanceToNext(), 800);
  };

  const handleSkip = () => advanceToNext();

  const handleSuperLike = () => {
    setLikedIds((prev) => [...prev, currentPerson.id]);
    setMatchIds((prev) => [...prev, currentPerson.id]);
    setShowMatchOverlay(true);
    setTimeout(() => {
      setShowMatchOverlay(false);
      advanceToNext();
    }, 2500);
  };

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft <= 30 ? '#ef4444' : timeLeft <= 60 ? '#f97316' : '#a855f7';
  const timerGlow = timeLeft <= 30
    ? '0 0 20px rgba(239,68,68,0.6)'
    : timeLeft <= 60
    ? '0 0 16px rgba(249,115,22,0.5)'
    : '0 0 12px rgba(168,85,247,0.4)';

  return (
    <div className="min-h-screen bg-brand-dark pb-safe flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 z-10">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <ChevronLeft size={20} className="text-white/70" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
            Video Speed-Dating
          </h1>
          <div className="flex items-center gap-1 justify-center mt-0.5">
            <Users size={11} className="text-purple-400" />
            <span className="text-xs text-white/50">{waitingCount} Personen warten</span>
          </div>
        </div>
        <button
          onClick={() => router.back()}
          className="text-xs font-medium px-3 py-1.5 rounded-full border"
          style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
        >
          Beenden
        </button>
      </div>

      {/* Main video area */}
      <div className="flex-1 relative px-4 pb-4 flex flex-col gap-3">
        {/* Partner camera (main) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: transitioning ? 0 : 1, scale: transitioning ? 0.95 : 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-3xl overflow-hidden flex-1 min-h-0"
            style={{
              background: 'linear-gradient(135deg, #1c1635, #120f22)',
              minHeight: 320,
              boxShadow: '0 8px 40px rgba(147,51,234,0.25)',
            }}
          >
            <img
              src={`https://picsum.photos/seed/${currentPerson.seed}/400/600`}
              alt={currentPerson.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(7,6,15,0.9) 0%, transparent 50%)' }}
            />
            {/* Name/info */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
                    {currentPerson.name}, {currentPerson.age}
                  </h2>
                  <p className="text-white/70 text-sm mt-0.5">{currentPerson.job} · {currentPerson.city}</p>
                </div>
                {likedIds.includes(currentPerson.id) && (
                  <span className="text-2xl">❤️</span>
                )}
              </div>
            </div>

            {/* Timer bar — prominent strip at top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/10 rounded-t-3xl overflow-hidden">
              <motion.div
                animate={{ width: `${timerPct}%` }}
                transition={{ duration: 0.5, ease: 'linear' }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${timerColor}, ${timerColor}cc)`,
                  boxShadow: timerGlow,
                }}
              />
            </div>

            {/* Timer badge */}
            <motion.div
              animate={timeLeft <= 10 ? { scale: [1, 1.12, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-mono font-bold text-lg flex items-center gap-2"
              style={{
                background: 'rgba(0,0,0,0.55)',
                color: timerColor,
                backdropFilter: 'blur(8px)',
                border: `1.5px solid ${timerColor}40`,
                boxShadow: timerGlow,
              }}
            >
              {formatTime(timeLeft)}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* PiP — Your camera */}
        <div
          className="absolute top-28 right-7 w-24 h-32 rounded-2xl overflow-hidden z-20"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #f43f8e)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.15)',
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-end pb-2">
            <span className="text-xs font-semibold text-white/90">Du</span>
          </div>
        </div>

        {/* Ice breaker panel */}
        <AnimatePresence>
          {showIceBreaker && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(147,51,234,0.35)' }}
            >
              <MessageSquare size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mb-1">
                  Gesprächsstarter
                </p>
                <p className="text-white text-sm font-medium leading-snug">
                  {ICE_BREAKERS[currentIceBreaker]}
                </p>
              </div>
              <button
                onClick={() => setCurrentIceBreaker((prev) => (prev + 1) % ICE_BREAKERS.length)}
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <ChevronRight size={12} className="text-white/60" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-5 pt-1 pb-1">
          {/* Überspringen */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}
            onClick={handleSkip}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(239,68,68,0.15)',
              border: '2px solid rgba(239,68,68,0.4)',
            }}
          >
            <X size={28} className="text-red-400" />
          </motion.button>

          {/* Ice breaker toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06 }}
            onClick={() => setShowIceBreaker((v) => !v)}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: showIceBreaker ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)',
              border: `2px solid ${showIceBreaker ? 'rgba(147,51,234,0.7)' : 'rgba(255,255,255,0.12)'}`,
            }}
          >
            <MessageSquare size={18} className={showIceBreaker ? 'text-purple-300' : 'text-white/60'} />
          </motion.button>

          {/* Liken */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1, boxShadow: '0 6px 30px rgba(34,197,94,0.7)' }}
            onClick={handleLike}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              boxShadow: '0 4px 20px rgba(34,197,94,0.5)',
            }}
          >
            <Heart size={32} className="text-white fill-white" />
          </motion.button>

          {/* Super Like */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08, boxShadow: '0 0 24px rgba(234,179,8,0.5)' }}
            onClick={handleSuperLike}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(234,179,8,0.15)',
              border: '2px solid rgba(234,179,8,0.4)',
            }}
          >
            <Star size={24} className="text-yellow-400 fill-yellow-400" />
          </motion.button>
        </div>
      </div>

      {/* Liked Toast */}
      <AnimatePresence>
        {showLikedToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl z-50 text-sm font-semibold text-white"
            style={{
              background: 'rgba(34,197,94,0.9)',
              backdropFilter: 'blur(8px)',
            }}
          >
            ❤️ Geliked!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Overlay */}
      <AnimatePresence>
        {showMatchOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(7,6,15,0.92)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-7xl mb-6"
            >
              🎉
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold gradient-text mb-2"
              style={{ fontFamily: 'Syne, Inter, sans-serif' }}
            >
              Ein Match!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 text-base text-center px-8"
            >
              Du und {currentPerson.name} mögt euch gegenseitig ❤️
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats bar — matched count */}
      {matchIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-2"
        >
          <div
            className="rounded-2xl px-4 py-2.5 flex items-center justify-between"
            style={{ background: 'rgba(244,63,142,0.1)', border: '1px solid rgba(244,63,142,0.2)' }}
          >
            <span className="text-white/60 text-xs">Heutige Matches</span>
            <span className="text-pink-300 text-xs font-bold">{matchIds.length} ❤️</span>
          </div>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
