'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface GiftAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  giftName: string;
  giftEmoji: string;
  senderName: string;
}

function Particle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{
        x: x * 200,
        y: y * 200,
        scale: 0,
        opacity: 0,
      }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
      style={{ backgroundColor: color, top: '50%', left: '50%' }}
    />
  );
}

const COLORS = ['#f43f8e', '#a855f7', '#fbbf24', '#34d399', '#60a5fa', '#f97316'];

export default function GiftAnimation({
  isOpen,
  onClose,
  giftName,
  giftEmoji,
  senderName,
}: GiftAnimationProps) {
  const [opened, setOpened] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.cos((i / 20) * Math.PI * 2) * (0.5 + Math.random() * 0.5),
      y: Math.sin((i / 20) * Math.PI * 2) * (0.5 + Math.random() * 0.5),
      color: COLORS[i % COLORS.length],
    }))
  );

  useEffect(() => {
    if (!isOpen) setOpened(false);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-xl"
        >
          <button
            onClick={onClose}
            className="absolute top-14 right-5 w-9 h-9 card-glass rounded-xl flex items-center justify-center"
          >
            <X size={18} className="text-white" />
          </button>

          <div className="text-center px-8 relative">
            {/* Particles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence>
                {opened &&
                  particles.map((p) => (
                    <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
                  ))}
              </AnimatePresence>
            </div>

            <p className="text-white/50 text-sm mb-6">
              <span className="text-white font-semibold">{senderName}</span> sent you a gift!
            </p>

            <motion.button
              onClick={() => setOpened(true)}
              whileTap={{ scale: 0.92 }}
              animate={opened ? {} : {
                scale: [1, 1.05, 1],
                rotate: [-2, 2, -2, 2, 0],
              }}
              transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
              className="relative text-8xl mb-6 block mx-auto"
            >
              {opened ? giftEmoji : '🎁'}
            </motion.button>

            <AnimatePresence>
              {opened ? (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <h2 className="text-white font-black text-2xl mb-2">{giftName}</h2>
                  <p className="text-white/50 text-sm mb-8">How sweet! {senderName} is thinking of you 💕</p>
                  <button
                    onClick={onClose}
                    className="gradient-brand text-white font-bold px-10 py-3 rounded-2xl"
                  >
                    Send Thanks 💬
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-white/40 text-sm mb-6">Tap the gift to open it!</p>
                  <motion.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="inline-block"
                  >
                    <div className="w-3 h-3 gradient-brand rounded-full mx-auto opacity-60" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
