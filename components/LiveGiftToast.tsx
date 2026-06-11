'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LiveGift } from '@/lib/liveData';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface GiftToastItem {
  id: string;
  senderName: string;
  senderColor: string;
  gift: LiveGift & { tier?: string; animationType?: string };
  count: number;
  ts: number;
}

interface Props {
  items: GiftToastItem[];
  onExpire: (id: string) => void;
}

// ─── Tier colour helper ─────────────────────────────────────────────────────────

function tierGradient(tier?: string): string {
  switch (tier) {
    case 'uncommon':  return 'from-blue-600/80 to-indigo-700/80';
    case 'rare':      return 'from-violet-600/80 to-purple-700/80';
    case 'epic':      return 'from-pink-600/80 to-rose-700/80';
    case 'legendary': return 'from-yellow-500/80 to-orange-600/80';
    default:          return 'from-gray-700/80 to-gray-800/80';
  }
}

function tierBorder(tier?: string): string {
  switch (tier) {
    case 'uncommon':  return 'border-blue-400/50';
    case 'rare':      return 'border-violet-400/60';
    case 'epic':      return 'border-pink-400/60';
    case 'legendary': return 'border-yellow-400/70';
    default:          return 'border-white/20';
  }
}

// ─── Single toast card ──────────────────────────────────────────────────────────

function GiftCard({ item, onExpire }: { item: GiftToastItem; onExpire: () => void }) {
  useEffect(() => {
    const t = setTimeout(onExpire, item.gift.tier === 'legendary' || item.gift.tier === 'epic' ? 4500 : 3000);
    return () => clearTimeout(t);
  }, [item.id]);

  const isLegendary = item.gift.tier === 'legendary';
  const isEpic      = item.gift.tier === 'epic';

  return (
    <motion.div
      initial={{ x: -280, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -280, opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`flex items-center gap-2.5 bg-gradient-to-r ${tierGradient(item.gift.tier)} backdrop-blur-md border ${tierBorder(item.gift.tier)} rounded-2xl pl-2 pr-3 py-2 shadow-xl max-w-[220px]`}
    >
      {/* Sender avatar */}
      <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex-shrink-0 flex items-center justify-center overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${item.senderName}/80/80`}
          alt={item.senderName}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-[11px] truncate" style={{ color: item.senderColor }}>
          {item.senderName}
        </p>
        <p className="text-white/70 text-[10px]">schickte</p>
      </div>

      {/* Gift */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.span
          animate={isLegendary
            ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }
            : isEpic
              ? { scale: [1, 1.15, 1] }
              : { scale: 1 }}
          transition={{ repeat: isLegendary || isEpic ? Infinity : 0, duration: 0.8 }}
          className="text-2xl leading-none"
        >
          {item.gift.emoji}
        </motion.span>
        <span className="text-white text-[9px] font-semibold mt-0.5 leading-none">{item.gift.name}</span>
      </div>

      {/* Count badge */}
      {item.count > 1 && (
        <motion.div
          key={item.count}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center"
        >
          <span className="text-white font-black text-[10px]">×{item.count > 99 ? '99+' : item.count}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Burst particles ────────────────────────────────────────────────────────────

function BurstParticles({ emoji, tier }: { emoji: string; tier?: string }) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (360 / 12) * i,
    distance: 60 + Math.random() * 40,
    size: 10 + Math.random() * 8,
  }));

  if (tier === 'common') return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            scale: 1.5,
          }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: Math.random() * 0.2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm"
          style={{ fontSize: p.size }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Fullscreen legendary overlay ──────────────────────────────────────────────

function LegendaryOverlay({ item, onDone }: { item: GiftToastItem; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, []);

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    size: 12 + Math.random() * 20,
    duration: 1.5 + Math.random() * 1.5,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      onClick={onDone}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: '110vh', x: `${p.x}vw` }}
          animate={{ opacity: [0, 1, 0], y: '-20vh' }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          className="absolute pointer-events-none"
          style={{ fontSize: p.size, left: 0, top: 0 }}
        >
          {item.gift.emoji}
        </motion.div>
      ))}

      {/* Center card */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center gap-4"
      >
        {/* Gift emoji */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-9xl drop-shadow-2xl"
        >
          {item.gift.emoji}
        </motion.div>

        {/* Name + sender */}
        <div className="text-center">
          <p className="text-white font-black text-2xl font-display">{item.gift.name}</p>
          <p className="text-white/60 text-sm mt-1">
            von <span className="font-bold" style={{ color: item.senderColor }}>{item.senderName}</span>
            {item.count > 1 && <span className="text-yellow-400 font-black ml-2">×{item.count}</span>}
          </p>
        </div>

        {/* Coin value */}
        <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
          <span className="text-yellow-400 font-black text-sm">🪙</span>
          <span className="text-white font-bold text-sm">{item.gift.coinCost.toLocaleString()} coins</span>
        </div>

        <p className="text-white/30 text-xs">Tippen zum Schließen</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────────

export default function LiveGiftToast({ items, onExpire }: Props) {
  const [fullscreenItem, setFullscreenItem] = useState<GiftToastItem | null>(null);

  // Trigger fullscreen for legendary/epic
  useEffect(() => {
    const epic = items.find((i) => (i.gift.tier === 'legendary' || i.gift.tier === 'epic') && !fullscreenItem);
    if (epic) setFullscreenItem(epic);
  }, [items]);

  const toastItems = items.filter(
    (i) => !(i.gift.tier === 'legendary' || i.gift.tier === 'epic') || !fullscreenItem
  );

  return (
    <>
      {/* Toast stack */}
      <div className="absolute bottom-44 left-3 z-40 flex flex-col-reverse gap-2 pointer-events-none">
        <AnimatePresence>
          {toastItems.slice(-5).map((item) => (
            <div key={item.id} className="relative">
              <GiftCard item={item} onExpire={() => onExpire(item.id)} />
              <BurstParticles emoji={item.gift.emoji} tier={item.gift.tier} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fullscreen legendary */}
      <AnimatePresence>
        {fullscreenItem && (
          <LegendaryOverlay
            key={fullscreenItem.id}
            item={fullscreenItem}
            onDone={() => { onExpire(fullscreenItem.id); setFullscreenItem(null); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
