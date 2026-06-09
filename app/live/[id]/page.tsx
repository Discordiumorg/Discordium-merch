'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Share2, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import {
  liveStreams,
  liveGifts,
  generateLiveMessages,
  formatViewerCount,
  formatStreamDuration,
  categoryMeta,
  type LiveMessage,
  type LiveStream,
} from '@/lib/liveData';

interface FloatingHeart {
  id: number;
  x: number;
}

interface FloatingGift {
  id: number;
  emoji: string;
}

const INITIAL_COINS = 150;

export default function StreamViewerPage() {
  const router = useRouter();
  const params = useParams();
  const streamId = params?.id as string;

  const stream: LiveStream | undefined = liveStreams.find((s) => s.id === streamId);

  const [messages, setMessages] = useState<LiveMessage[]>(() => generateLiveMessages().slice(0, 10));
  const [viewerCount, setViewerCount] = useState(stream?.viewerCount ?? 0);
  const [likeCount, setLikeCount] = useState(stream?.likeCount ?? 0);
  const [isFollowing, setIsFollowing] = useState(stream?.isFollowing ?? false);
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [floatingGifts, setFloatingGifts] = useState<FloatingGift[]>([]);
  const [heartIdRef] = useState({ current: 0 });
  const [giftIdRef] = useState({ current: 0 });
  const messagePool = useRef<LiveMessage[]>(generateLiveMessages());
  const poolIndex = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate incoming messages every 2-3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const pool = messagePool.current;
      const msg = pool[poolIndex.current % pool.length];
      poolIndex.current++;

      // Give a fresh id to avoid key collisions
      const freshMsg: LiveMessage = {
        ...msg,
        id: `live-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const next = [...prev, freshMsg];
        return next.slice(-12); // keep last 12
      });
    }, 2000 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, []);

  // Increment viewer count every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((v) => v + Math.floor(Math.random() * 5) + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = useCallback(() => {
    setLikeCount((c) => c + 1);
    // Spawn 3-5 floating hearts
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const id = ++heartIdRef.current;
      const x = 60 + Math.random() * 30; // % from left
      setTimeout(() => {
        setFloatingHearts((prev) => [...prev, { id, x }]);
        setTimeout(() => {
          setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
        }, 1500);
      }, i * 120);
    }
  }, [heartIdRef]);

  const sendGift = useCallback((giftId: string) => {
    const gift = liveGifts.find((g) => g.id === giftId);
    if (!gift || coins < gift.coinCost) return;

    setCoins((c) => c - gift.coinCost);

    // Add gift message to chat
    const giftMsg: LiveMessage = {
      id: `gift-${Date.now()}`,
      userId: 'me',
      userName: 'You',
      text: `You sent ${gift.name} ${gift.emoji}`,
      type: 'gift',
      giftEmoji: gift.emoji,
      giftName: gift.name,
      timestamp: new Date(),
      color: '#f472b6',
    };
    setMessages((prev) => [...prev.slice(-11), giftMsg]);

    // Floating gift animation
    const id = ++giftIdRef.current;
    setFloatingGifts((prev) => [...prev, { id, emoji: gift.emoji }]);
    setTimeout(() => {
      setFloatingGifts((prev) => prev.filter((g) => g.id !== id));
    }, 2000);
  }, [coins, giftIdRef]);

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const msg: LiveMessage = {
      id: `my-${Date.now()}`,
      userId: 'me',
      userName: 'You',
      text: chatInput.trim(),
      type: 'chat',
      timestamp: new Date(),
      color: '#a78bfa',
    };
    setMessages((prev) => [...prev.slice(-11), msg]);
    setChatInput('');
  };

  if (!stream) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Stream not found</p>
          <button onClick={() => router.push('/live')} className="gradient-brand text-white px-6 py-3 rounded-2xl font-bold">
            Back to Live
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background: blurred host photo */}
      <div className="absolute inset-0">
        <img
          src={stream.hostPhoto}
          alt=""
          className="w-full h-full object-cover blur-xl scale-110 opacity-60"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ repeat: Infinity, duration: 4 }}
        className={`absolute inset-0 bg-gradient-to-br ${stream.color} mix-blend-overlay`}
      />

      {/* Center: host photo as "video feed" */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="relative"
          style={{ width: '65%', aspectRatio: '3/4' }}
        >
          <img
            src={stream.hostPhoto}
            alt={stream.hostName}
            className="w-full h-full object-cover rounded-2xl"
            style={{ boxShadow: '0 0 40px rgba(0,0,0,0.6)' }}
          />
        </motion.div>
      </div>

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex-1 mx-3 max-w-[50%]">
            <p className="text-white font-semibold text-sm truncate text-center">{stream.title}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* LIVE + viewers */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"
              />
              <span className="text-white font-bold text-xs">LIVE</span>
              <span className="text-white/70 text-xs">{formatViewerCount(viewerCount)}</span>
            </div>

            <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── HOST INFO (left, lower section) ── */}
      <div className="absolute z-30" style={{ bottom: '42%', left: '12px' }}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="relative flex-shrink-0">
            <img
              src={stream.hostPhoto}
              alt={stream.hostName}
              className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-[-3px] rounded-full border-2 border-red-500 pointer-events-none"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-sm">{stream.hostName}</span>
              <span className="text-white/60 text-xs">{stream.hostAge}</span>
              {stream.hostVerified && (
                <span className="text-blue-400 text-xs">✓</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-white/60 text-[10px]">
                {categoryMeta[stream.category].emoji} {categoryMeta[stream.category].label}
              </span>
              <span className="text-white/30 text-[10px]">·</span>
              <span className="text-white/60 text-[10px]">
                {formatStreamDuration(stream.startedAt)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFollowing((f) => !f)}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
            isFollowing
              ? 'bg-white/20 text-white/80 border border-white/20'
              : 'gradient-brand text-white'
          }`}
        >
          {isFollowing ? 'Following ✓' : '+ Follow'}
        </button>
      </div>

      {/* ── RIGHT SIDE ACTIONS ── */}
      <div className="absolute z-30 flex flex-col items-center gap-5" style={{ bottom: '42%', right: '12px' }}>
        {/* Like */}
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={handleLike}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Heart size={22} className="text-pink-400" fill="#f472b6" />
          </div>
          <span className="text-white text-[10px] font-semibold">{formatViewerCount(likeCount)}</span>
        </motion.button>

        {/* Chat toggle */}
        <button
          onClick={() => setShowChat((c) => !c)}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
            showChat ? 'bg-purple-500/60' : 'bg-black/40'
          }`}>
            <MessageCircle size={22} className="text-white" />
          </div>
          <span className="text-white text-[10px] font-semibold">Chat</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Share2 size={20} className="text-white/80" />
          </div>
          <span className="text-white text-[10px] font-semibold">Share</span>
        </button>

        {/* More */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <MoreHorizontal size={20} className="text-white/80" />
          </div>
          <span className="text-white text-[10px] font-semibold">More</span>
        </button>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Gift bar */}
        <div className="px-3 mb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
            {liveGifts.map((gift) => (
              <motion.button
                key={gift.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => sendGift(gift.id)}
                disabled={coins < gift.coinCost}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 border transition-colors ${
                  coins >= gift.coinCost
                    ? 'border-white/20 hover:border-purple-500/60'
                    : 'border-white/10 opacity-40'
                }`}
              >
                <span className="text-xl leading-none">{gift.emoji}</span>
                <span className="text-white/80 text-[9px] font-semibold">{gift.coinCost}🪙</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Coins display */}
        <div className="px-4 mb-1">
          <span className="text-white/50 text-[10px]">🪙 {coins} coins</span>
        </div>

        {/* Chat overlay */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-3 mb-2"
              style={{ maxHeight: '30vh' }}
            >
              {/* Messages */}
              <div className="overflow-y-auto mb-2" style={{ maxHeight: '22vh' }}>
                {messages.map((msg) => (
                  <div key={msg.id} className="mb-1.5">
                    {msg.type === 'join' ? (
                      <span className="text-white/40 text-xs">
                        👋 {msg.text}
                      </span>
                    ) : msg.type === 'gift' ? (
                      <span className="inline-flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {msg.giftEmoji} {msg.text}
                      </span>
                    ) : (
                      <span className="text-xs">
                        <span className="font-bold" style={{ color: msg.color }}>{msg.userName} </span>
                        <span className="text-white/90">{msg.text}</span>
                      </span>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage(); }}
                  placeholder="Say something..."
                  className="flex-1 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendChatMessage}
                  className="w-9 h-9 gradient-brand rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <Send size={15} className="text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Safe area padding */}
        <div className="h-4" />
      </div>

      {/* ── FLOATING HEARTS ── */}
      <AnimatePresence>
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -150, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute z-40 pointer-events-none text-2xl"
            style={{ bottom: '45%', left: `${heart.x}%` }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── FLOATING GIFT ANIMATION ── */}
      <AnimatePresence>
        {floatingGifts.map((giftAnim) => (
          <motion.div
            key={giftAnim.id}
            initial={{ opacity: 0, scale: 0.3, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.5, 1.5, 0.8], y: [-20, -40, -80, -120] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute z-50 pointer-events-none text-6xl"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {giftAnim.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
