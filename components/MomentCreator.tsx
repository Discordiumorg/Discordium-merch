'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MomentCreatorProps {
  onClose: () => void;
}

const gradientOptions = [
  { id: 'g1', style: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', label: 'Purple Pink' },
  { id: 'g2', style: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)', label: 'Sunset' },
  { id: 'g3', style: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', label: 'Ocean' },
  { id: 'g4', style: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', label: 'Mint' },
  { id: 'g5', style: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', label: 'Gold' },
  { id: 'g6', style: 'linear-gradient(135deg, #ec4899 0%, #f97316 50%, #f59e0b 100%)', label: 'Warm' },
];

const emojiOptions = ['😊', '❤️', '🔥', '✨', '😂', '🥰', '💫', '🌟', '🎉', '💃', '🌈', '🦋'];

export default function MomentCreator({ onClose }: MomentCreatorProps) {
  const [selectedGradient, setSelectedGradient] = useState(gradientOptions[0]);
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);

  const handlePost = () => {
    if (!message.trim() && !selectedEmoji) return;
    setPosted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-brand-card rounded-t-3xl z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="px-5 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-lg">Add Moment ⚡</h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Preview */}
          <div
            className="w-full h-36 rounded-2xl flex items-center justify-center mb-5 relative overflow-hidden"
            style={{ background: selectedGradient.style }}
          >
            {selectedEmoji && (
              <span className="absolute top-4 right-4 text-3xl">{selectedEmoji}</span>
            )}
            <p className="text-white font-bold text-center text-lg px-6 leading-snug drop-shadow">
              {message || 'Your moment preview...'}
            </p>
            <div className="absolute bottom-2 right-3 bg-black/30 text-white/70 text-[10px] font-semibold px-2 py-1 rounded-full">
              ⏱ 2h
            </div>
          </div>

          {/* Gradient picker */}
          <div className="mb-4">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Background</p>
            <div className="flex gap-2">
              {gradientOptions.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGradient(g)}
                  className={`w-10 h-10 rounded-xl flex-shrink-0 transition-all ${
                    selectedGradient.id === g.id
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-brand-card scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ background: g.style }}
                />
              ))}
            </div>
          </div>

          {/* Text input */}
          <div className="mb-4">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Message</p>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 120))}
                placeholder="What's on your mind?"
                rows={2}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 resize-none"
              />
              <span className="absolute bottom-2 right-3 text-white/30 text-[10px]">
                {message.length}/120
              </span>
            </div>
          </div>

          {/* Emoji picker */}
          <div className="mb-5">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Add emoji</p>
            <div className="flex gap-2 flex-wrap">
              {emojiOptions.map((em) => (
                <button
                  key={em}
                  onClick={() => setSelectedEmoji(selectedEmoji === em ? null : em)}
                  className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    selectedEmoji === em
                      ? 'bg-purple-500/30 ring-1 ring-purple-500/60 scale-110'
                      : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Post button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePost}
            disabled={!message.trim() && !selectedEmoji}
            className={`w-full font-bold py-4 rounded-2xl transition-all ${
              message.trim() || selectedEmoji
                ? 'gradient-brand text-white'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
            style={
              message.trim() || selectedEmoji
                ? { boxShadow: '0 0 20px rgba(124,58,237,0.35)' }
                : {}
            }
          >
            Post Moment (2h) 🔥
          </motion.button>
        </div>
      </motion.div>

      {/* Success toast */}
      <AnimatePresence>
        {posted && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[60] bg-green-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 pointer-events-none"
          >
            🔥 Your moment is live!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
