'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Flame, X, RotateCcw } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const PEOPLE = [
  { id: 1, name: 'Sophie', age: 26, seed: 'sophie1' },
  { id: 2, name: 'Elena', age: 24, seed: 'elena1' },
  { id: 3, name: 'Marcus', age: 29, seed: 'marcus1' },
  { id: 4, name: 'Lena', age: 27, seed: 'lena1' },
  { id: 5, name: 'Julia', age: 31, seed: 'julia1' },
  { id: 6, name: 'Kai', age: 25, seed: 'kai1' },
  { id: 7, name: 'Tom', age: 28, seed: 'tom1' },
  { id: 8, name: 'Mia', age: 23, seed: 'mia1' },
  { id: 9, name: 'Anna', age: 25, seed: 'anna1' },
  { id: 10, name: 'Leo', age: 30, seed: 'leo1' },
  { id: 11, name: 'Nika', age: 24, seed: 'nika1' },
  { id: 12, name: 'Daniel', age: 27, seed: 'daniel1' },
  { id: 13, name: 'Sara', age: 22, seed: 'sara1' },
  { id: 14, name: 'Max', age: 29, seed: 'max1' },
  { id: 15, name: 'Cleo', age: 26, seed: 'cleo1' },
  { id: 16, name: 'Felix', age: 31, seed: 'felix1' },
  { id: 17, name: 'Hana', age: 23, seed: 'hana1' },
  { id: 18, name: 'Luis', age: 28, seed: 'luis1' },
  { id: 19, name: 'Mona', age: 25, seed: 'mona1' },
  { id: 20, name: 'Remy', age: 27, seed: 'remy1' },
];

const TOTAL = PEOPLE.length;

function getRating(pct: number): string {
  if (pct >= 80) return 'Smooth operator 😎';
  if (pct >= 60) return "You've got taste! 🔥";
  if (pct >= 40) return 'Selective but fair 🤌';
  if (pct >= 20) return "You're picky! 🧐";
  return 'Ice cold! 🧊';
}

function SwipeCard({
  person,
  onVote,
  isTop,
}: {
  person: (typeof PEOPLE)[number];
  onVote: (hot: boolean) => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const hotOpacity = useTransform(x, [30, 120], [0, 1]);
  const notOpacity = useTransform(x, [-120, -30], [1, 0]);

  if (!isTop) {
    return (
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          transform: 'scale(0.95) translateY(12px)',
          background: '#1c1635',
          border: '1px solid rgba(147,51,234,0.2)',
        }}
      />
    );
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 80) {
          onVote(info.offset.x > 0);
        }
      }}
      className="absolute inset-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <img
        src={`https://picsum.photos/seed/${person.seed}/400/600`}
        alt={person.name}
        className="w-full h-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(7,6,15,0.88) 0%, transparent 50%)' }}
      />

      {/* HOT label */}
      <motion.div
        className="absolute top-10 right-6 px-4 py-2 rounded-xl font-bold text-xl text-green-400"
        style={{
          border: '3px solid #4ade80',
          opacity: hotOpacity as unknown as number,
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        🔥 HOT
      </motion.div>

      {/* NOT label */}
      <motion.div
        className="absolute top-10 left-6 px-4 py-2 rounded-xl font-bold text-xl text-white/80"
        style={{
          border: '3px solid rgba(255,255,255,0.5)',
          opacity: notOpacity as unknown as number,
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        ❌ NOT
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
          {person.name}, {person.age}
        </h2>
      </div>
    </motion.div>
  );
}

export default function HotOrNotPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hotCount, setHotCount] = useState(0);
  const [votes, setVotes] = useState<boolean[]>([]);
  const [flyDirection, setFlyDirection] = useState<'left' | 'right' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const remaining = TOTAL - currentIdx;
  const hotPct = votes.length > 0 ? Math.round((hotCount / votes.length) * 100) : 0;

  const handleVote = (hot: boolean) => {
    if (currentIdx >= TOTAL) return;
    setFlyDirection(hot ? 'right' : 'left');
    if (hot) setHotCount((c) => c + 1);
    setVotes((v) => [...v, hot]);
    setTimeout(() => {
      setFlyDirection(null);
      const next = currentIdx + 1;
      setCurrentIdx(next);
      if (next >= TOTAL) setShowResult(true);
    }, 350);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setHotCount(0);
    setVotes([]);
    setFlyDirection(null);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-brand-dark pb-safe flex flex-col max-w-md mx-auto items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="text-7xl mb-6"
        >
          {hotPct >= 60 ? '🔥' : hotPct >= 30 ? '😎' : '🧊'}
        </motion.div>
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
          Your Hot Score
        </h2>
        <div
          className="w-40 h-40 rounded-full flex items-center justify-center my-6"
          style={{
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            boxShadow: '0 0 40px rgba(239,68,68,0.5)',
          }}
        >
          <span className="text-5xl font-bold text-white">{hotPct}%</span>
        </div>
        <p className="text-xl text-white mb-2 font-semibold">{getRating(hotPct)}</p>
        <p className="text-white/50 text-sm mb-8 text-center">
          You found {hotCount} out of {TOTAL} people hot
        </p>

        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          <div className="card-glass rounded-2xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{hotCount}</div>
            <div className="text-xs text-white/50 mt-0.5">🔥 Hot</div>
          </div>
          <div className="card-glass rounded-2xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{TOTAL - hotCount}</div>
            <div className="text-xs text-white/50 mt-0.5">❌ Not</div>
          </div>
          <div className="card-glass rounded-2xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{TOTAL}</div>
            <div className="text-xs text-white/50 mt-0.5">Total</div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRestart}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 gradient-brand glow-button"
        >
          <RotateCcw size={18} />
          Play Again
        </motion.button>
        <BottomNav />
      </div>
    );
  }

  const currentPerson = PEOPLE[currentIdx];
  const nextPerson = PEOPLE[currentIdx + 1];

  return (
    <div className="min-h-screen bg-brand-dark pb-safe flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-orange-400" />
          <span className="font-bold text-white text-lg" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
            Hot or Not
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-orange-400">{hotCount} 🔥 Hot</span>
          <span className="text-sm text-white/40">{remaining} left</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-4">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)' }}
            animate={{ width: `${(currentIdx / TOTAL) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/30">{currentIdx} / {TOTAL}</span>
          <span className="text-xs text-white/30">{remaining} remaining</span>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative mx-4" style={{ minHeight: 420 }}>
        <AnimatePresence>
          {nextPerson && (
            <div key={`bg-${nextPerson.id}`} className="absolute inset-0">
              <SwipeCard person={nextPerson} onVote={() => {}} isTop={false} />
            </div>
          )}
          {currentPerson && (
            <motion.div
              key={`card-${currentPerson.id}`}
              className="absolute inset-0"
              animate={
                flyDirection === 'right'
                  ? { x: 500, rotate: 20, opacity: 0 }
                  : flyDirection === 'left'
                  ? { x: -500, rotate: -20, opacity: 0 }
                  : { x: 0, rotate: 0, opacity: 1 }
              }
              transition={{ duration: 0.35, ease: 'easeIn' }}
            >
              <SwipeCard person={currentPerson} onVote={handleVote} isTop={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-6 px-4 py-5">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => handleVote(false)}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(30,27,50,0.9)',
            border: '2px solid rgba(255,255,255,0.12)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <X size={32} className="text-white/60" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => handleVote(true)}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            boxShadow: '0 4px 24px rgba(239,68,68,0.5)',
          }}
        >
          <Flame size={36} className="text-white fill-white" />
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
