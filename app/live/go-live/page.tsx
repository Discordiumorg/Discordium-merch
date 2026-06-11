'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, X, Video, Mic, MicOff, Users, Zap, Gem,
  ChevronRight, Check, Clock, Gift, Heart, Send, Camera,
} from 'lucide-react';
import { liveGifts, categoryMeta, type LiveCategory } from '@/lib/liveData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  color: string;
  isOwn?: boolean;
  timestamp: Date;
}

interface GiftToast {
  id: number;
  senderName: string;
  giftEmoji: string;
  giftName: string;
  coins: number;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MY_PHOTO = 'https://picsum.photos/seed/me26/400/700';

const CATEGORIES: Array<{ id: LiveCategory | 'special'; emoji: string; label: string }> = [
  { id: 'dating',   emoji: '💕', label: 'Dating'   },
  { id: 'chat',     emoji: '💬', label: 'Chat'      },
  { id: 'music',    emoji: '🎵', label: 'Music'     },
  { id: 'dance',    emoji: '💃', label: 'Dance'     },
  { id: 'cooking',  emoji: '🍳', label: 'Cooking'   },
  { id: 'gaming',   emoji: '🎮', label: 'Gaming'    },
  { id: 'travel',   emoji: '✈️', label: 'Travel'    },
  { id: 'advice',   emoji: '💡', label: 'Advice'    },
  { id: 'special',  emoji: '✨', label: 'Special'   },
];

const VIEWER_NAMES = [
  'LoveHunter99', 'SparkleQueen', 'DatingPro', 'HeartEyes', 'RomanceSeeker',
  'NightOwl22', 'FlirtyFox', 'CasualVibes', 'MoonlitSoul', 'VibingRn',
];

const VIEWER_COLORS = [
  '#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24',
  '#fb923c', '#e879f9', '#38bdf8', '#4ade80', '#f87171',
];

const CHAT_TEXTS = [
  'omg this is so cute 😍',
  'hey! just joined from Berlin 👋',
  'you are literally glowing rn',
  'first time watching you live ❤️',
  'the vibe is immaculate',
  'can you do a Q&A??',
  'sending love from Munich 💜',
  'been watching for 20 mins now',
  'stream more plz 🙏',
  'this made my night honestly',
  'lowkey obsessed with your energy',
  'omg YES finally someone gets it',
  'so relatable honestly',
  'your laugh is contagious lol',
  'same here!! exactly how I feel',
];

let globalMsgId = 0;

function makeMockMsg(idx: number): ChatMessage {
  const userIdx = idx % VIEWER_NAMES.length;
  return {
    id: `mock-${++globalMsgId}-${Date.now()}`,
    userId: `u${userIdx}`,
    userName: VIEWER_NAMES[userIdx],
    text: CHAT_TEXTS[idx % CHAT_TEXTS.length],
    color: VIEWER_COLORS[userIdx % VIEWER_COLORS.length],
    timestamp: new Date(),
  };
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatEuro(diamonds: number): string {
  return `€${(diamonds * 0.01).toFixed(2)}`;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GoLivePage() {
  const router = useRouter();

  // ── Setup state ────────────────────────────────────────────────────────────
  const [isLive, setIsLive]                     = useState(false);
  const [streamTitle, setStreamTitle]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('dating');
  const [privacy, setPrivacy]                   = useState<'all' | 'followers'>('all');
  const [ageRestricted, setAgeRestricted]       = useState(false);
  const [showAgeConfirm, setShowAgeConfirm]     = useState(false);
  const [titleError, setTitleError]             = useState(false);

  // ── Streaming state ────────────────────────────────────────────────────────
  const [duration, setDuration]                 = useState(0);
  const [viewerCount, setViewerCount]           = useState(0);
  const [totalCoins, setTotalCoins]             = useState(0);
  const [chatMessages, setChatMessages]         = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput]               = useState('');
  const [giftToasts, setGiftToasts]             = useState<GiftToast[]>([]);
  const [floatingEmojis, setFloatingEmojis]     = useState<FloatingEmoji[]>([]);
  const [showEndConfirm, setShowEndConfirm]     = useState(false);
  const [micOn, setMicOn]                       = useState(true);
  const [toastId]                               = useState({ current: 0 });
  const [emojiId]                               = useState({ current: 0 });
  const [mockMsgIdx]                            = useState({ current: 0 });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Auto-scroll chat ───────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ── Duration timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, [isLive]);

  // ── Viewer count ramp-up ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => {
      setViewerCount((v) => {
        if (v >= 250) return v + Math.floor(Math.random() * 3);
        return v + Math.floor(Math.random() * 8) + 2;
      });
    }, 3500);
    return () => clearInterval(t);
  }, [isLive]);

  // ── Incoming chat messages ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => {
      const msg = makeMockMsg(mockMsgIdx.current++);
      setChatMessages((prev) => [...prev.slice(-18), msg]);
    }, 2000 + Math.random() * 1200);
    return () => clearInterval(t);
  }, [isLive, mockMsgIdx]);

  // ── Incoming gifts ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLive) return;
    const scheduleGift = () => {
      const delay = 10000 + Math.random() * 5000;
      return setTimeout(() => {
        const gift = liveGifts[Math.floor(Math.random() * liveGifts.length)];
        const sender = VIEWER_NAMES[Math.floor(Math.random() * VIEWER_NAMES.length)];
        const id = ++toastId.current;
        const emojiToastId = ++emojiId.current;
        const x = 20 + Math.random() * 60;

        // Add gift toast
        setGiftToasts((prev) => [...prev.slice(-3), { id, senderName: sender, giftEmoji: gift.emoji, giftName: gift.name, coins: gift.coinCost }]);
        setTimeout(() => setGiftToasts((prev) => prev.filter((t) => t.id !== id)), 4000);

        // Increment coins (streamer earns the gift value)
        setTotalCoins((c) => c + gift.coinCost);

        // Floating emoji
        setFloatingEmojis((prev) => [...prev, { id: emojiToastId, emoji: gift.emoji, x }]);
        setTimeout(() => setFloatingEmojis((prev) => prev.filter((e) => e.id !== emojiToastId)), 2500);

        // Add gift chat message
        const giftMsg: ChatMessage = {
          id: `gift-${Date.now()}`,
          userId: sender,
          userName: sender,
          text: `${sender} hat ${gift.name} ${gift.emoji} gesendet`,
          color: '#fbbf24',
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev.slice(-18), giftMsg]);

        scheduleGift();
      }, delay);
    };

    const timer = scheduleGift();
    return () => clearTimeout(timer);
  }, [isLive, toastId, emojiId]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleGoLive = useCallback(() => {
    if (!streamTitle.trim()) {
      setTitleError(true);
      setTimeout(() => setTitleError(false), 2000);
      return;
    }
    setDuration(0);
    setViewerCount(0);
    setTotalCoins(0);
    setChatMessages([]);
    setIsLive(true);
  }, [streamTitle]);

  const handleEndStream = useCallback(() => {
    setIsLive(false);
    setShowEndConfirm(false);
    setDuration(0);
    setViewerCount(0);
    setTotalCoins(0);
    setChatMessages([]);
  }, []);

  const sendChat = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: `own-${Date.now()}`,
      userId: 'me',
      userName: 'Du',
      text,
      color: '#a78bfa',
      isOwn: true,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev.slice(-18), msg]);
    setChatInput('');
  }, [chatInput]);

  const diamonds = Math.floor(totalCoins * 0.5);

  // ════════════════════════════════════════════════════════════════════════════
  // MODE 1: SETUP
  // ════════════════════════════════════════════════════════════════════════════

  if (!isLive) {
    return (
      <div className="min-h-screen bg-brand-dark pb-safe overflow-y-auto">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-12 pb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full card-glass flex items-center justify-center text-white/80 active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-bold text-lg">Go Live</h1>
        </div>

        <div className="px-4 space-y-4 pb-8">

          {/* Cover photo */}
          <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '9/16', maxHeight: '45vh' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-pink-900" />
            <img
              src={MY_PHOTO}
              alt="Vorschau"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            {/* Camera overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 flex items-center justify-center"
              >
                <Camera size={28} className="text-white" />
              </motion.div>
            </div>
            {/* Preview badge */}
            <div className="absolute bottom-3 left-3">
              <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white/70 text-xs font-semibold">
                <Video size={11} />
                Kamera-Vorschau
              </span>
            </div>
          </div>

          {/* Form card */}
          <div className="card-glass rounded-2xl p-4 space-y-5">

            {/* Stream title */}
            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
                Stream-Titel
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value.slice(0, 80))}
                  placeholder="Worum geht es in deinem Stream?"
                  maxLength={80}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none transition-colors ${
                    titleError
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-white/10 focus:border-purple-500/60'
                  }`}
                />
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold transition-colors ${
                  streamTitle.length >= 70 ? 'text-orange-400' : 'text-white/25'
                }`}>
                  {streamTitle.length}/80
                </span>
              </div>
              <AnimatePresence>
                {titleError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-red-400 text-xs mt-1.5 font-medium"
                  >
                    Bitte gib einen Titel ein.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Category picker */}
            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2.5">
                Kategorie
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all text-center ${
                      selectedCategory === cat.id
                        ? 'border-purple-500/60 bg-purple-500/20 shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                        : 'border-white/10 bg-white/3 hover:bg-white/6'
                    }`}
                  >
                    <span className="text-xl leading-none">{cat.emoji}</span>
                    <span className={`text-[11px] font-semibold ${selectedCategory === cat.id ? 'text-purple-300' : 'text-white/50'}`}>
                      {cat.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Privacy toggle */}
            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2.5">
                Sichtbarkeit
              </label>
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                {(['all', 'followers'] as const).map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setPrivacy(opt)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                      privacy === opt
                        ? 'gradient-brand text-white shadow-sm'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {opt === 'all' ? '🌍 Alle' : '👥 Nur Follower'}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Age restriction toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-semibold">Altersfreigabe (18+)</p>
                <p className="text-white/30 text-xs mt-0.5">Inhalte nur für Erwachsene</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (!ageRestricted) {
                    setShowAgeConfirm(true);
                  } else {
                    setAgeRestricted(false);
                  }
                }}
                className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${
                  ageRestricted ? 'bg-pink-500' : 'bg-white/15'
                }`}
              >
                <motion.div
                  animate={{ x: ageRestricted ? 22 : 3 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1.5 w-4 h-4 bg-white rounded-full shadow"
                />
              </motion.button>
            </div>

          </div>

          {/* Earnings teaser */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #9333ea 40%, #ec4899 100%)' }}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💎</span>
                <h3 className="text-white font-bold text-base">Verdiene mit Gifts</h3>
              </div>
              <p className="text-white/75 text-sm leading-relaxed mb-4">
                Zuschauer schicken dir Gifts mit echtem Wert. Du erhältst <span className="text-white font-bold">50%</span> als Diamonds.
              </p>
              <div className="flex gap-2">
                {[
                  { label: '100 Roses', sub: '50 Diamonds ≈ €0.50' },
                  { label: '500 Stars', sub: '250 Diamonds ≈ €2.50' },
                  { label: '1000 💎', sub: '500 Diamonds ≈ €5.00' },
                ].map((item) => (
                  <div key={item.label} className="flex-1 bg-white/15 rounded-xl px-2 py-2.5 text-center">
                    <p className="text-white font-bold text-xs leading-tight">{item.label}</p>
                    <p className="text-white/60 text-[10px] mt-0.5 leading-tight">= {item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-white/60 text-xs">
                <ChevronRight size={12} />
                <span>Mehr über Diamonds & Auszahlungen erfahren</span>
              </div>
            </div>
          </div>

          {/* Go live button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoLive}
            className="w-full gradient-brand glow-button rounded-2xl py-4 text-white font-bold text-lg flex items-center justify-center gap-2.5 active:brightness-90 transition-all"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
            />
            Live gehen
          </motion.button>

        </div>

        {/* Age confirm bottom sheet */}
        <AnimatePresence>
          {showAgeConfirm && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowAgeConfirm(false)}
                className="fixed inset-0 bg-black/60 z-50"
              />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-brand-card rounded-t-3xl z-[60] px-5 pt-4 pb-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
                <h3 className="text-white font-bold text-lg mb-2">Altersfreigabe aktivieren?</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Dein Stream wird als 18+ markiert. Zuschauer müssen ihr Alter bestätigt haben, um ihn sehen zu können. Stelle sicher, dass du die Community-Richtlinien einhältst.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => { setAgeRestricted(true); setShowAgeConfirm(false); }}
                    className="w-full gradient-brand text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Ja, 18+ aktivieren
                  </button>
                  <button
                    onClick={() => setShowAgeConfirm(false)}
                    className="w-full py-3.5 text-white/40 text-sm font-semibold"
                  >
                    Abbrechen
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MODE 2: STREAMING
  // ════════════════════════════════════════════════════════════════════════════

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">

      {/* ── Background & "camera" ─────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <img
          src={MY_PHOTO}
          alt=""
          className="w-full h-full object-cover blur-2xl scale-110 opacity-50"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Breathing glow overlay */}
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-transparent to-pink-900/40"
      />

      {/* Main "video" — the streamer's view */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.012, 1] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="relative"
          style={{ width: '70%', aspectRatio: '3/4' }}
        >
          <img
            src={MY_PHOTO}
            alt="Dein Stream"
            className="w-full h-full object-cover rounded-2xl"
            style={{ boxShadow: '0 0 50px rgba(147,51,234,0.4), 0 0 100px rgba(0,0,0,0.8)' }}
          />
          {/* Live ring */}
          <motion.div
            animate={{ opacity: [0.6, 0.2, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-[-3px] rounded-2xl border-2 border-red-500/70 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* ── TOP BAR ─────────────────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-12 pb-3">
        <div className="flex items-center justify-between gap-3">

          {/* Stop button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEndConfirm(true)}
            className="w-10 h-10 rounded-full bg-red-600/80 backdrop-blur-sm border border-red-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.5)]"
          >
            <X size={18} className="text-white" />
          </motion.button>

          {/* Center info */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            {/* Timer */}
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
              <Clock size={11} className="text-white/60" />
              <span className="text-white font-mono text-xs font-bold">{formatDuration(duration)}</span>
            </div>

            {/* LIVE badge */}
            <div className="flex items-center gap-1.5 bg-red-600/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-red-500/40">
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-white inline-block"
              />
              <span className="text-white font-bold text-xs tracking-wider">LIVE</span>
            </div>

            {/* Viewer count */}
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
              <Users size={11} className="text-white/60" />
              <span className="text-white font-bold text-xs">{viewerCount}</span>
            </div>
          </div>

          {/* Mic toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMicOn((m) => !m)}
            className={`w-10 h-10 rounded-full backdrop-blur-sm border flex items-center justify-center transition-colors ${
              micOn
                ? 'bg-black/50 border-white/15 text-white/80'
                : 'bg-red-600/80 border-red-500/50 text-white'
            }`}
          >
            {micOn ? <Mic size={16} /> : <MicOff size={16} />}
          </motion.button>
        </div>
      </div>

      {/* ── EARNINGS PANEL (bottom-left) ────────────────────────────────────────── */}
      <div className="absolute z-30" style={{ bottom: '44%', left: '12px' }}>
        <div className="card-glass rounded-2xl p-3 min-w-[130px]">
          <p className="text-white/30 text-[9px] font-semibold uppercase tracking-wider mb-2">Einnahmen</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Zap size={11} className="text-yellow-400 flex-shrink-0" />
              <span className="text-white/60 text-[11px]">Coins</span>
              <span className="text-yellow-300 font-bold text-sm ml-auto">{totalCoins}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gem size={11} className="text-cyan-400 flex-shrink-0" />
              <span className="text-white/60 text-[11px]">Diamonds</span>
              <span className="text-cyan-300 font-bold text-sm ml-auto">{diamonds}</span>
            </div>
            <div className="h-px bg-white/10 my-1" />
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-[10px]">ca.</span>
              <span className="text-green-300 font-bold text-sm">{formatEuro(diamonds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION ──────────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-30">

        {/* Chat messages */}
        <div className="px-3 mb-2">
          <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '25vh' }}>
            {chatMessages.map((msg) => {
              const isGift = msg.text.includes('hat ') && msg.text.includes('gesendet');
              if (isGift) {
                return (
                  <div key={msg.id} className="mb-1.5">
                    <span className="inline-flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      {msg.text}
                    </span>
                  </div>
                );
              }
              return (
                <div key={msg.id} className="mb-1.5">
                  <span className="text-xs">
                    {msg.isOwn && (
                      <span className="inline-flex items-center gap-0.5 bg-purple-500/30 text-purple-300 text-[9px] font-bold px-1 rounded mr-1">
                        Du
                      </span>
                    )}
                    <span className="font-bold" style={{ color: msg.color }}>{msg.userName} </span>
                    <span className="text-white/90">{msg.text}</span>
                  </span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Chat input */}
        <div className="px-3 pb-8">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }}
              placeholder="Antworte deinen Zuschauern…"
              className="flex-1 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={sendChat}
              className="w-10 h-10 gradient-brand rounded-full flex items-center justify-center flex-shrink-0"
            >
              <Send size={15} className="text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── GIFT TOASTS (slide in from left) ────────────────────────────────────── */}
      <div className="absolute z-40" style={{ bottom: '44%', left: '12px' }}>
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {giftToasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-yellow-500/30 rounded-2xl px-3 py-2 shadow-xl max-w-[200px]"
              >
                <span className="text-2xl leading-none flex-shrink-0">{toast.giftEmoji}</span>
                <div className="min-w-0">
                  <p className="text-yellow-300 font-bold text-[11px] leading-tight truncate">{toast.senderName}</p>
                  <p className="text-white/60 text-[10px] leading-tight">{toast.giftName} · {toast.coins}🪙</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── FLOATING EMOJIS ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {floatingEmojis.map((fe) => (
          <motion.div
            key={fe.id}
            initial={{ opacity: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 1, 0], y: -200, scale: [0.4, 1.6, 1.4, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute z-50 pointer-events-none text-4xl"
            style={{ bottom: '40%', left: `${fe.x}%` }}
          >
            {fe.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── END STREAM CONFIRMATION SHEET ────────────────────────────────────────── */}
      <AnimatePresence>
        {showEndConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEndConfirm(false)}
              className="fixed inset-0 bg-black/70 z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-brand-card rounded-t-3xl z-[70] px-5 pt-4 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

              <h3 className="text-white font-bold text-xl mb-1">Stream beenden?</h3>
              <p className="text-white/40 text-sm mb-5">Dein Stream wird beendet und nicht mehr sichtbar sein.</p>

              {/* Summary */}
              <div className="card-glass rounded-2xl p-4 mb-5 space-y-3">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Stream-Zusammenfassung</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center bg-white/5 rounded-xl py-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock size={12} className="text-white/40" />
                      <span className="text-white/40 text-xs">Dauer</span>
                    </div>
                    <p className="text-white font-bold text-lg">{formatDuration(duration)}</p>
                  </div>
                  <div className="text-center bg-white/5 rounded-xl py-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users size={12} className="text-white/40" />
                      <span className="text-white/40 text-xs">Zuschauer</span>
                    </div>
                    <p className="text-white font-bold text-lg">{viewerCount}</p>
                  </div>
                  <div className="text-center bg-white/5 rounded-xl py-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap size={12} className="text-yellow-400" />
                      <span className="text-white/40 text-xs">Coins</span>
                    </div>
                    <p className="text-yellow-300 font-bold text-lg">{totalCoins}</p>
                  </div>
                  <div className="text-center bg-white/5 rounded-xl py-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Gem size={12} className="text-cyan-400" />
                      <span className="text-white/40 text-xs">Diamonds</span>
                    </div>
                    <p className="text-cyan-300 font-bold text-lg">{diamonds}</p>
                  </div>
                </div>
                {/* Euro value */}
                <div className="flex items-center justify-between bg-gradient-to-r from-green-900/40 to-emerald-900/30 border border-green-500/20 rounded-xl px-4 py-3">
                  <span className="text-white/60 text-sm font-semibold">Geschätzter Wert</span>
                  <span className="text-green-300 font-bold text-xl">{formatEuro(diamonds)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEndStream}
                  className="w-full py-4 rounded-2xl bg-red-600/80 border border-red-500/50 text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                  <X size={18} />
                  Stream beenden
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowEndConfirm(false)}
                  className="w-full py-4 rounded-2xl gradient-brand text-white font-bold text-base glow-button"
                >
                  Weitermachen
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
