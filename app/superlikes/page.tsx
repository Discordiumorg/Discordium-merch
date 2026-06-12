'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Heart, X, Crown, MessageCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

interface SuperLiker {
  id: string;
  name: string;
  age: number;
  emoji: string;
  location: string;
  bio: string;
  tags: string[];
  superlikedAt: string;
  isPremium?: boolean;
  blurred?: boolean;
}

const SUPERLIKERS: SuperLiker[] = [
  { id: '1', name: 'Anna', age: 27, emoji: '💜', location: 'Berlin', bio: 'Fotografin mit Liebe zu Café-Hopping und langen Spaziergängen 📸', tags: ['Fotografie', 'Reisen', 'Yoga'], superlikedAt: 'Vor 2h' },
  { id: '2', name: 'Mia', age: 24, emoji: '✨', location: 'Berlin-Mitte', bio: 'Designstudentin, Kaffee-Nerd, immer auf der Suche nach dem nächsten Abenteuer', tags: ['Design', 'Kaffee', 'Musik'], superlikedAt: 'Vor 5h' },
  { id: '3', name: '???', age: 0, emoji: '🔒', location: '?', bio: '', tags: [], superlikedAt: 'Vor 1T', blurred: true, isPremium: true },
  { id: '4', name: '???', age: 0, emoji: '🔒', location: '?', bio: '', tags: [], superlikedAt: 'Vor 2T', blurred: true, isPremium: true },
  { id: '5', name: '???', age: 0, emoji: '🔒', location: '?', bio: '', tags: [], superlikedAt: 'Vor 3T', blurred: true, isPremium: true },
];

export default function SuperlikesPage() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [showMatch, setShowMatch] = useState<SuperLiker | null>(null);

  const visible = SUPERLIKERS.filter(s => !dismissed.has(s.id));
  const freeCount = SUPERLIKERS.filter(s => !s.blurred).length;
  const blurredCount = SUPERLIKERS.filter(s => s.blurred).length;

  const handleLike = (person: SuperLiker) => {
    setLiked(prev => new Set([...prev, person.id]));
    setShowMatch(person);
  };

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <h1 className="text-white font-black text-xl">⭐ Super-Likes</h1>
          <div className="ml-auto bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full">
            {freeCount} offen
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-2xl p-5 border border-blue-500/20 text-center">
          <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="text-5xl mb-2">⭐</motion.div>
          <p className="text-white font-black text-lg">Jemand findet dich besonders!</p>
          <p className="text-white/50 text-sm mt-1">{freeCount} Personen haben dir einen Super-Like geschickt</p>
          <div className="flex justify-center gap-3 mt-4">
            <div className="bg-white/5 rounded-xl px-4 py-2 text-center">
              <p className="text-blue-300 font-black text-xl">{SUPERLIKERS.length}</p>
              <p className="text-white/40 text-xs">Gesamt</p>
            </div>
            <div className="bg-white/5 rounded-xl px-4 py-2 text-center">
              <p className="text-green-300 font-black text-xl">{liked.size}</p>
              <p className="text-white/40 text-xs">Gemacht</p>
            </div>
            <div className="bg-white/5 rounded-xl px-4 py-2 text-center">
              <p className="text-purple-300 font-black text-xl">{blurredCount}</p>
              <p className="text-white/40 text-xs">Premium</p>
            </div>
          </div>
        </motion.div>

        {/* Premium upsell */}
        {blurredCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass rounded-2xl p-4 border border-yellow-500/20 flex items-center gap-3">
            <Crown size={20} className="text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-bold text-sm">{blurredCount} weitere Profile freischalten</p>
              <p className="text-white/40 text-xs">Mit Premium Gold siehst du alle Super-Likes</p>
            </div>
            <button onClick={() => router.push('/premium')} className="gradient-brand text-white text-xs font-bold px-3 py-2 rounded-xl glow-button">Gold</button>
          </motion.div>
        )}

        {/* Superlikers list */}
        <AnimatePresence>
          {visible.map((person, i) => {
            const isLiked = liked.has(person.id);
            if (person.blurred) {
              return (
                <motion.div key={person.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card-glass rounded-2xl p-4 border border-white/8 relative overflow-hidden">
                  <div className="flex items-center gap-4 filter blur-sm select-none">
                    <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">👤</div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/10 rounded-full w-24 mb-2" />
                      <div className="h-3 bg-white/5 rounded-full w-32 mb-2" />
                      <div className="flex gap-1">
                        {[1, 2, 3].map(j => <div key={j} className="h-5 bg-white/5 rounded-full w-14" />)}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                    <button onClick={() => router.push('/premium')} className="gradient-brand text-white text-sm font-bold px-5 py-2.5 rounded-2xl glow-button flex items-center gap-2">
                      <Crown size={14} /> Premium freischalten
                    </button>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -80, scale: 0.9 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 24 }}
                className={`card-glass rounded-2xl p-4 border ${isLiked ? 'border-green-500/40' : 'border-white/8'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 gradient-brand">
                    {person.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-white font-bold text-base">{person.name}, {person.age}</p>
                        <p className="text-white/40 text-xs flex items-center gap-1">📍 {person.location} · {person.superlikedAt}</p>
                      </div>
                      <span className="text-blue-300 text-xs bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full flex-shrink-0">⭐ Super-Like</span>
                    </div>
                    {person.bio && <p className="text-white/60 text-xs mb-2 line-clamp-2">{person.bio}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {person.tags.map(t => <span key={t} className="text-white/40 text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{t}</span>)}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                {!isLiked && (
                  <div className="flex gap-2 mt-3">
                    <motion.button whileTap={{ scale: 0.88 }} onClick={() => handleDismiss(person.id)} className="flex-1 bg-white/8 border border-white/10 text-white/50 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-sm">
                      <X size={15} /> Ablehnen
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.88 }} onClick={() => router.push(`/matches`)} className="w-12 bg-white/8 border border-white/10 text-white/50 font-semibold py-2.5 rounded-xl flex items-center justify-center">
                      <MessageCircle size={15} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.88 }} onClick={() => handleLike(person)} className="flex-1 gradient-brand text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-sm glow-button">
                      <Heart size={15} /> Liken
                    </motion.button>
                  </div>
                )}

                {isLiked && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-3 flex items-center justify-center gap-2 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                    <span className="text-green-400 text-sm font-bold">✓ Geliked — es ist ein Match!</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visible.filter(v => !v.blurred).length === 0 && dismissed.size > 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">✨</p>
            <p className="text-white/50 text-sm">Alle Super-Likes bearbeitet!</p>
            <p className="text-white/30 text-xs mt-1">Neue kommen täglich — schau morgen wieder vorbei</p>
          </div>
        )}
      </div>

      {/* Match modal */}
      <AnimatePresence>
        {showMatch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 340, damping: 24 }} className="bg-brand-card rounded-3xl p-8 text-center w-full max-w-sm">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 0.8 }} className="text-6xl mb-4">⭐</motion.div>
              <h2 className="text-white font-black text-2xl mb-2">Es ist ein Match!</h2>
              <p className="text-white/60 text-sm mb-6">Du und {showMatch.name} habt euch gegenseitig geliked!</p>
              <div className="flex gap-3">
                <button onClick={() => setShowMatch(null)} className="flex-1 bg-white/10 text-white/70 py-3 rounded-2xl font-semibold">Weiter suchen</button>
                <button onClick={() => { setShowMatch(null); router.push('/matches'); }} className="flex-1 gradient-brand text-white font-bold py-3 rounded-2xl glow-button">Schreiben</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
