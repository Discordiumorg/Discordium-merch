'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, MessageCircle, Star, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface MatchInsightsProps {
  matchName: string;
  matchAge: number;
  matchEmoji?: string;
  compatibilityScore: number;
  sharedInterests: string[];
  personalityTraits: { label: string; value: number; color: string }[];
  conversationStarters: string[];
  aiSummary: string;
}

const COMPATIBILITY_LABEL = (score: number) => {
  if (score >= 90) return { text: 'Perfekte Verbindung', color: '#a855f7' };
  if (score >= 75) return { text: 'Starke Chemie', color: '#ec4899' };
  if (score >= 60) return { text: 'Gute Basis', color: '#22c55e' };
  return { text: 'Erkunde ihn/sie', color: '#f59e0b' };
};

export default function MatchInsights({
  matchName,
  compatibilityScore,
  sharedInterests,
  personalityTraits,
  conversationStarters,
  aiSummary,
}: MatchInsightsProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedStarter, setCopiedStarter] = useState<number | null>(null);
  const compat = COMPATIBILITY_LABEL(compatibilityScore);

  const copyStarter = (text: string, i: number) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedStarter(i);
    setTimeout(() => setCopiedStarter(null), 1800);
  };

  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      {/* Header */}
      <motion.button
        onClick={() => setExpanded(v => !v)}
        whileTap={{ scale: 0.98 }}
        className="w-full p-4 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
          <Brain size={16} className="text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-white font-bold text-sm">KI-Kompatibilitätsanalyse</p>
          <p className="text-white/40 text-xs">mit {matchName}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-lg" style={{ color: compat.color }}>{compatibilityScore}%</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
            <ChevronDown size={16} className="text-white/40" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-white/8 pt-4">
              {/* Compatibility ring */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <motion.circle
                      cx="40" cy="40" r="32"
                      fill="none"
                      stroke={compat.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - compatibilityScore / 100) }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-black text-base" style={{ color: compat.color }}>{compatibilityScore}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-base">{compat.text}</p>
                  <p className="text-white/50 text-xs mt-1 leading-relaxed">{aiSummary}</p>
                </div>
              </div>

              {/* Shared interests */}
              {sharedInterests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart size={12} className="text-pink-400" />
                    <p className="text-white/60 text-xs uppercase tracking-wider">Gemeinsame Interessen</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sharedInterests.map(interest => (
                      <motion.span
                        key={interest}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-pink-300 text-xs bg-pink-500/15 border border-pink-500/25 px-2.5 py-1 rounded-full"
                      >
                        {interest}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Personality traits */}
              {personalityTraits.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={12} className="text-yellow-400" />
                    <p className="text-white/60 text-xs uppercase tracking-wider">Persönlichkeitsprofil</p>
                  </div>
                  <div className="space-y-2">
                    {personalityTraits.map((trait, i) => (
                      <div key={trait.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">{trait.label}</span>
                          <span className="text-white/80 font-semibold">{trait.value}%</span>
                        </div>
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${trait.value}%` }}
                            transition={{ delay: i * 0.1 + 0.4, type: 'spring', stiffness: 200, damping: 24 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: trait.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation starters */}
              {conversationStarters.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={12} className="text-purple-400" />
                    <p className="text-white/60 text-xs uppercase tracking-wider">Gesprächseinstieg</p>
                  </div>
                  <div className="space-y-2">
                    {conversationStarters.map((starter, i) => (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => copyStarter(starter, i)}
                        className="w-full text-left bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3 group"
                      >
                        <span className="text-white/70 text-xs leading-relaxed">{starter}</span>
                        <AnimatePresence mode="wait">
                          {copiedStarter === i ? (
                            <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-green-400 text-xs font-bold flex-shrink-0">✓</motion.span>
                          ) : (
                            <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Zap size={11} className="text-white/20 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-white/25 text-[10px] mt-2 text-center">Tippe um in die Zwischenablage zu kopieren</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
