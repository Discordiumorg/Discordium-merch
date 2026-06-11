'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Share2, Heart, MessageCircle, Send,
  Shield, ShieldCheck, Trash2, Clock, Ban, Pin,
  X, ChevronRight, Filter, Activity, Flag, Settings, Check, Zap,
} from 'lucide-react';
import {
  liveStreams, liveGifts, generateLiveMessages, formatViewerCount,
  formatStreamDuration, categoryMeta,
  type LiveMessage, type ModActionType,
} from '@/lib/liveData';
import LiveGiftToast, { type GiftToastItem } from '@/components/LiveGiftToast';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FloatingHeart { id: number; x: number; }
interface FloatingGift  { id: number; emoji: string; }
interface ModLogEntry   { id: string; type: ModActionType; detail: string; ts: Date; }

const DEFAULT_BLOCKED_WORDS = ['spam', 'hate', 'scam', 'fake', 'nsfw'];

function applyWordFilter(text: string, blocked: string[]): { out: string; flagged: boolean } {
  let out = text;
  let flagged = false;
  for (const w of blocked) {
    const re = new RegExp(`\\b${w}\\b`, 'gi');
    if (re.test(out)) { flagged = true; out = out.replace(re, '[***]'); }
  }
  return { out, flagged };
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const INITIAL_COINS = 150;

const MOD_LOG_LABELS: Record<ModActionType, string> = {
  delete: '🗑 Gelöscht', timeout_5m: '⏱ Timeout 5 Min', timeout_1h: '⏱ Timeout 1 Std',
  ban: '🚫 Gebannt', unban: '✅ Entbannt', pin: '📌 Angepinnt', unpin: '📌 Entpinnt',
  clear_chat: '🧹 Chat geleert', slow_mode: '🐢 Slow Mode geändert',
  sub_only: '⭐ Sub-Only geändert', word_filter: '🔤 Wortfilter geändert',
};

export default function StreamViewerPage() {
  const router = useRouter();
  const params = useParams();
  const streamId = params?.id as string;
  const stream = liveStreams.find((s) => s.id === streamId);

  // ── viewer state ───────────────────────────────────────────────────────────
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
  const [giftIdRef]  = useState({ current: 0 });

  // ── moderation state ───────────────────────────────────────────────────────
  const [isMod, setIsMod]           = useState(false);
  const [showModPanel, setShowModPanel] = useState(false);
  const [modTab, setModTab]         = useState<'settings' | 'flagged' | 'log'>('settings');
  const [slowMode, setSlowMode]     = useState<0 | 5 | 10 | 30>(0);
  const [slowCooldown, setSlowCooldown] = useState(0);
  const [lastSentAt, setLastSentAt] = useState(0);
  const [subOnlyMode, setSubOnlyMode]   = useState(false);
  const [wordFilterOn, setWordFilterOn] = useState(true);
  const [blockedWords, setBlockedWords] = useState<string[]>(DEFAULT_BLOCKED_WORDS);
  const [newWord, setNewWord]       = useState('');
  const [pinnedMsg, setPinnedMsg]   = useState<LiveMessage | null>(null);
  const [timedOutUsers, setTimedOutUsers] = useState<Set<string>>(new Set());
  const [bannedUsers, setBannedUsers]     = useState<Set<string>>(new Set());
  const [modLog, setModLog]         = useState<ModLogEntry[]>([]);
  const [selectedMsg, setSelectedMsg]     = useState<LiveMessage | null>(null);
  const [reportedIds, setReportedIds]     = useState<Set<string>>(new Set());
  const [toast, setToast]           = useState('');
  const [giftToastItems, setGiftToastItems] = useState<GiftToastItem[]>([]);

  const messagePool = useRef<LiveMessage[]>(generateLiveMessages());
  const poolIndex   = useRef(0);
  const chatEndRef  = useRef<HTMLDivElement>(null);
  const cdRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const addGiftToast = useCallback((senderName: string, senderColor: string, gift: (typeof liveGifts)[0]) => {
    const tier = gift.coinCost >= 500 ? 'legendary' : gift.coinCost >= 200 ? 'epic' : gift.coinCost >= 100 ? 'rare' : gift.coinCost >= 25 ? 'uncommon' : 'common';
    setGiftToastItems((prev) => {
      const existing = prev.find((i) => i.senderName === senderName && i.gift.id === gift.id && Date.now() - i.ts < 3000);
      if (existing) return prev.map((i) => i.id === existing.id ? { ...i, count: i.count + 1 } : i);
      return [...prev, {
        id: `gt-${Date.now()}-${Math.random()}`,
        senderName,
        senderColor,
        gift: { ...gift, tier, animationType: tier === 'legendary' ? 'legendary' : tier === 'epic' ? 'fullscreen' : 'toast' },
        count: 1,
        ts: Date.now(),
      }];
    });
  }, []);

  // ── auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ── incoming messages ───────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      const raw = messagePool.current[poolIndex.current % messagePool.current.length];
      poolIndex.current++;
      if (bannedUsers.has(raw.userId) || timedOutUsers.has(raw.userId)) return;

      let text = raw.text;
      let flagged = raw.flagged ?? false;
      if (wordFilterOn && raw.type === 'chat') {
        const r = applyWordFilter(text, blockedWords);
        text = r.out; flagged = flagged || r.flagged;
      }
      setMessages((p) => [...p.slice(-14), { ...raw, id: `live-${Date.now()}-${Math.random()}`, text, flagged, timestamp: new Date() }]);
      if (raw.type === 'gift' && raw.giftEmoji) {
        const matchedGift = liveGifts.find((g) => g.emoji === raw.giftEmoji);
        if (matchedGift) addGiftToast(raw.userName, raw.color, matchedGift);
      }
    }, 2000 + Math.random() * 1200);
    return () => clearInterval(t);
  }, [bannedUsers, timedOutUsers, wordFilterOn, blockedWords, addGiftToast]);

  // ── viewer count ────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setViewerCount((v) => v + Math.floor(Math.random() * 4) + 1), 30000);
    return () => clearInterval(t);
  }, []);

  // ── slow-mode countdown ─────────────────────────────────────────────────────
  useEffect(() => {
    if (slowCooldown <= 0) return;
    cdRef.current = setInterval(() => {
      setSlowCooldown((c) => {
        if (c <= 1) { if (cdRef.current) clearInterval(cdRef.current); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => { if (cdRef.current) clearInterval(cdRef.current); };
  }, [slowCooldown]);

  // ── mod log ─────────────────────────────────────────────────────────────────
  const logMod = useCallback((type: ModActionType, detail: string) => {
    setModLog((p) => [{ id: `ml-${Date.now()}`, type, detail, ts: new Date() }, ...p.slice(0, 49)]);
  }, []);

  // ── like ────────────────────────────────────────────────────────────────────
  const handleLike = useCallback(() => {
    setLikeCount((c) => c + 1);
    for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
      const id = ++heartIdRef.current;
      const x  = 55 + Math.random() * 30;
      setTimeout(() => {
        setFloatingHearts((p) => [...p, { id, x }]);
        setTimeout(() => setFloatingHearts((p) => p.filter((h) => h.id !== id)), 1500);
      }, i * 120);
    }
  }, [heartIdRef]);

  // ── send gift ───────────────────────────────────────────────────────────────
  const sendGift = useCallback((giftId: string) => {
    const gift = liveGifts.find((g) => g.id === giftId);
    if (!gift || coins < gift.coinCost) return;
    setCoins((c) => c - gift.coinCost);
    const gm: LiveMessage = {
      id: `gift-${Date.now()}`, userId: 'me', userName: 'Du',
      text: `Du hast ${gift.name} ${gift.emoji} gesendet`, type: 'gift',
      giftEmoji: gift.emoji, giftName: gift.name, timestamp: new Date(), color: '#f472b6',
    };
    setMessages((p) => [...p.slice(-13), gm]);
    const id = ++giftIdRef.current;
    setFloatingGifts((p) => [...p, { id, emoji: gift.emoji }]);
    setTimeout(() => setFloatingGifts((p) => p.filter((g) => g.id !== id)), 2000);
    addGiftToast('Du', '#a78bfa', gift);
  }, [coins, giftIdRef, addGiftToast]);

  // ── send chat ───────────────────────────────────────────────────────────────
  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    if (slowMode > 0 && !isMod) {
      const remaining = slowMode - (Date.now() - lastSentAt) / 1000;
      if (remaining > 0) { setSlowCooldown(Math.ceil(remaining)); return; }
    }
    if (subOnlyMode && !isMod) { showToast('Nur Abonnenten können chatten'); return; }

    let filtered = text, flagged = false;
    if (wordFilterOn) { const r = applyWordFilter(text, blockedWords); filtered = r.out; flagged = r.flagged; }

    setMessages((p) => [...p.slice(-13), {
      id: `my-${Date.now()}`, userId: 'me', userName: 'Du', text: filtered, type: 'chat',
      timestamp: new Date(), color: '#a78bfa', isMod, flagged,
    }]);
    setChatInput('');
    setLastSentAt(Date.now());
    setSlowCooldown(slowMode);
  };

  // ── mod action ──────────────────────────────────────────────────────────────
  const doModAction = (action: 'delete' | 'timeout_5m' | 'timeout_1h' | 'ban' | 'pin' | 'report') => {
    if (!selectedMsg) return;
    const { userId, userName, id } = selectedMsg;
    switch (action) {
      case 'delete':
        setMessages((p) => p.map((m) => m.id === id ? { ...m, deleted: true } : m));
        logMod('delete', `Nachricht von ${userName} gelöscht`); break;
      case 'timeout_5m':
        setTimedOutUsers((s) => new Set([...s, userId]));
        logMod('timeout_5m', `${userName} für 5 Min. stummgeschaltet`);
        setTimeout(() => setTimedOutUsers((s) => { const n = new Set(s); n.delete(userId); return n; }), 5 * 60_000); break;
      case 'timeout_1h':
        setTimedOutUsers((s) => new Set([...s, userId]));
        logMod('timeout_1h', `${userName} für 1 Std. stummgeschaltet`);
        setTimeout(() => setTimedOutUsers((s) => { const n = new Set(s); n.delete(userId); return n; }), 60 * 60_000); break;
      case 'ban':
        setBannedUsers((s) => new Set([...s, userId]));
        setMessages((p) => p.filter((m) => m.userId !== userId));
        logMod('ban', `${userName} dauerhaft gebannt`); break;
      case 'pin':
        setPinnedMsg(selectedMsg);
        logMod('pin', `Nachricht von ${userName} angepinnt`); break;
      case 'report':
        setReportedIds((s) => new Set([...s, id]));
        setMessages((p) => p.map((m) => m.id === id ? { ...m, reportCount: (m.reportCount ?? 0) + 1, flagged: true } : m));
        showToast('Nachricht gemeldet ✓'); break;
    }
    setSelectedMsg(null);
  };

  const flagged = messages.filter((m) => m.flagged && !m.deleted);

  if (!stream) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Stream nicht gefunden</p>
          <button onClick={() => router.push('/live')} className="gradient-brand text-white px-6 py-3 rounded-2xl font-bold">Zurück</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" onClick={() => selectedMsg && setSelectedMsg(null)}>

      {/* Background */}
      <div className="absolute inset-0">
        <img src={stream.hostPhoto} alt="" className="w-full h-full object-cover blur-xl scale-110 opacity-60" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <motion.div animate={{ opacity: [0.25, 0.4, 0.25] }} transition={{ repeat: Infinity, duration: 4 }}
        className={`absolute inset-0 bg-gradient-to-br ${stream.color} mix-blend-overlay`} />

      {/* Host "video" */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.01, 1] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="relative" style={{ width: '65%', aspectRatio: '3/4' }}>
          <img src={stream.hostPhoto} alt={stream.hostName}
            className="w-full h-full object-cover rounded-2xl" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.6)' }} />
        </motion.div>
      </div>

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
            <ArrowLeft size={18} />
          </button>
          <p className="flex-1 text-white font-semibold text-sm truncate text-center mx-3">{stream.title}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              <span className="text-white font-bold text-xs">LIVE</span>
              <span className="text-white/70 text-xs">{formatViewerCount(viewerCount)}</span>
            </div>
            {/* Demo toggle mod */}
            <button onClick={() => setIsMod((v) => !v)}
              className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${isMod ? 'bg-purple-500/70 text-white' : 'bg-black/40 text-white/50'}`}
              title="Mod-Modus (Demo)">
              <Shield size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Mod banner */}
        <AnimatePresence>
          {isMod && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="mt-2 flex items-center justify-between bg-purple-500/20 border border-purple-500/40 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-purple-300" />
                <span className="text-purple-300 text-xs font-semibold">Mod-Modus aktiv</span>
                <span className="text-purple-400/60 text-[10px] hidden sm:inline">· Nachricht antippen für Aktionen</span>
              </div>
              <button onClick={() => setShowModPanel(true)} className="text-purple-300 text-[11px] font-semibold flex items-center gap-0.5">
                Panel <ChevronRight size={11} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active mode pills */}
        <AnimatePresence>
          {(slowMode > 0 || subOnlyMode) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-1.5 flex gap-2">
              {slowMode > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 text-[10px] font-semibold bg-yellow-500/15 border border-yellow-500/25 rounded-full px-2 py-0.5">
                  <Clock size={9} />Slow {slowMode}s
                </span>
              )}
              {subOnlyMode && (
                <span className="flex items-center gap-1 text-blue-400 text-[10px] font-semibold bg-blue-500/15 border border-blue-500/25 rounded-full px-2 py-0.5">
                  <Zap size={9} />Sub-Only
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── HOST INFO ── */}
      <div className="absolute z-30" style={{ bottom: '42%', left: '12px' }}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="relative flex-shrink-0">
            <img src={stream.hostPhoto} alt={stream.hostName} className="w-12 h-12 rounded-full object-cover border-2 border-red-500" />
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-[-3px] rounded-full border-2 border-red-500 pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-sm">{stream.hostName}</span>
              <span className="text-white/60 text-xs">{stream.hostAge}</span>
              {stream.hostVerified && <span className="text-blue-400 text-xs">✓</span>}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-white/60 text-[10px]">{categoryMeta[stream.category].emoji} {categoryMeta[stream.category].label}</span>
              <span className="text-white/30 text-[10px]">·</span>
              <span className="text-white/60 text-[10px]">{formatStreamDuration(stream.startedAt)}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsFollowing((f) => !f)}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${isFollowing ? 'bg-white/20 text-white/80 border border-white/20' : 'gradient-brand text-white'}`}>
          {isFollowing ? 'Following ✓' : '+ Follow'}
        </button>
      </div>

      {/* ── RIGHT ACTIONS ── */}
      <div className="absolute z-30 flex flex-col items-center gap-5" style={{ bottom: '42%', right: '12px' }}>
        <motion.button whileTap={{ scale: 1.3 }} onClick={handleLike} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Heart size={22} className="text-pink-400" fill="#f472b6" />
          </div>
          <span className="text-white text-[10px] font-semibold">{formatViewerCount(likeCount)}</span>
        </motion.button>

        <button onClick={() => setShowChat((c) => !c)} className="flex flex-col items-center gap-1">
          <div className={`w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${showChat ? 'bg-purple-500/60' : 'bg-black/40'}`}>
            <MessageCircle size={22} className="text-white" />
          </div>
          <span className="text-white text-[10px] font-semibold">Chat</span>
        </button>

        {isMod && (
          <button onClick={() => setShowModPanel(true)} className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-purple-500/50 backdrop-blur-sm flex items-center justify-center relative">
              <Settings size={20} className="text-white" />
              {flagged.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-bold text-white">
                  {flagged.length}
                </span>
              )}
            </div>
            <span className="text-white text-[10px] font-semibold">Mod</span>
          </button>
        )}

        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Share2 size={20} className="text-white/80" />
          </div>
          <span className="text-white text-[10px] font-semibold">Teilen</span>
        </button>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30">

        {/* Pinned message */}
        <AnimatePresence>
          {pinnedMsg && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="mx-3 mb-2 bg-yellow-500/15 border border-yellow-500/30 backdrop-blur-sm rounded-xl px-3 py-2 flex items-start gap-2">
              <Pin size={11} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-yellow-400 text-[10px] font-semibold">Angepinnt · </span>
                <span className="text-white/90 text-xs">{pinnedMsg.text}</span>
              </div>
              {isMod && <button onClick={() => setPinnedMsg(null)} className="text-white/30 hover:text-white/70"><X size={12} /></button>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gift bar */}
        <div className="px-3 mb-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {liveGifts.map((gift) => (
              <motion.button key={gift.id} whileTap={{ scale: 0.9 }} onClick={() => sendGift(gift.id)}
                disabled={coins < gift.coinCost}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 border transition-colors ${
                  coins >= gift.coinCost ? 'border-white/20 hover:border-purple-500/60' : 'border-white/10 opacity-40'
                }`}>
                <span className="text-xl leading-none">{gift.emoji}</span>
                <span className="text-white/80 text-[9px] font-semibold">{gift.coinCost}🪙</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="px-4 mb-1"><span className="text-white/50 text-[10px]">🪙 {coins} coins</span></div>

        {/* Chat */}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="px-3 mb-2" style={{ maxHeight: '30vh' }}>
              <div className="overflow-y-auto mb-2 no-scrollbar" style={{ maxHeight: '22vh' }}>
                {messages.map((msg) => {
                  if (msg.deleted) return <div key={msg.id} className="mb-1.5"><span className="text-white/20 text-xs italic">[Nachricht gelöscht]</span></div>;
                  if (msg.type === 'join')   return <div key={msg.id} className="mb-1.5"><span className="text-white/40 text-xs">👋 {msg.text}</span></div>;
                  if (msg.type === 'gift')   return (
                    <div key={msg.id} className="mb-1.5">
                      <span className="inline-flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {msg.giftEmoji} {msg.text}
                      </span>
                    </div>
                  );
                  return (
                    <div key={msg.id} className="mb-1.5 group relative">
                      <span
                        className={`text-xs ${isMod ? 'cursor-pointer hover:opacity-80' : ''} ${msg.flagged ? 'bg-red-500/10 rounded px-1' : ''}`}
                        onClick={() => isMod && setSelectedMsg(msg)}
                        onContextMenu={(e) => { e.preventDefault(); setSelectedMsg(msg); }}
                      >
                        {msg.isMod && (
                          <span className="inline-flex items-center gap-0.5 bg-purple-500/30 text-purple-300 text-[9px] font-bold px-1 rounded mr-1">
                            <Shield size={7} />MOD
                          </span>
                        )}
                        {msg.isSubscriber && !msg.isMod && <span className="text-yellow-400 text-[9px] font-bold mr-0.5">⭐</span>}
                        {msg.flagged && isMod && <Flag size={8} className="inline text-red-400 mr-0.5" />}
                        <span className="font-bold" style={{ color: msg.color }}>{msg.userName} </span>
                        <span className="text-white/90">{msg.text}</span>
                      </span>
                      {!isMod && !reportedIds.has(msg.id) && (
                        <button
                          onClick={() => { setSelectedMsg(msg); setTimeout(() => doModAction('report'), 0); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-1 top-0 text-white/20 hover:text-red-400"
                        ><Flag size={10} /></button>
                      )}
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              <div className="flex items-center gap-2">
                <input type="text" value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }}
                  placeholder={subOnlyMode && !isMod ? 'Nur Abonnenten können chatten…' : 'Schreib etwas…'}
                  disabled={subOnlyMode && !isMod}
                  className="flex-1 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 disabled:opacity-40"
                />
                <motion.button whileTap={{ scale: 0.9 }} onClick={sendChat}
                  disabled={slowCooldown > 0 || (subOnlyMode && !isMod)}
                  className="w-9 h-9 gradient-brand rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50">
                  {slowCooldown > 0
                    ? <span className="text-white font-bold text-xs">{slowCooldown}</span>
                    : <Send size={15} className="text-white" />}
                </motion.button>
              </div>
              {slowCooldown > 0 && (
                <div className="mt-1 px-1 flex items-center gap-1 text-yellow-400 text-[10px] font-semibold">
                  <Clock size={9} />Slow Mode — bitte {slowCooldown}s warten
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="h-4" />
      </div>

      {/* ── MOD ACTION SHEET ── */}
      <AnimatePresence>
        {selectedMsg && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50" onClick={() => setSelectedMsg(null)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-brand-card rounded-t-3xl z-[60] px-5 pb-8 pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              <div className="mb-4 bg-white/5 rounded-xl px-3 py-2.5">
                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-1">Nachricht</p>
                <p className="text-white/80 text-sm line-clamp-2">{selectedMsg.text}</p>
                <p className="text-white/30 text-[10px] mt-1">von <span className="font-semibold" style={{ color: selectedMsg.color }}>{selectedMsg.userName}</span></p>
              </div>

              {isMod ? (
                <div className="space-y-2">
                  {[
                    { l: '📌 Anpinnen',           a: 'pin' as const,        c: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/25' },
                    { l: '🗑 Nachricht löschen',   a: 'delete' as const,     c: 'text-red-300 bg-red-500/15 border-red-500/25' },
                    { l: '⏱ Timeout 5 Minuten',    a: 'timeout_5m' as const, c: 'text-orange-300 bg-orange-500/15 border-orange-500/25' },
                    { l: '⏱ Timeout 1 Stunde',     a: 'timeout_1h' as const, c: 'text-orange-400 bg-orange-500/20 border-orange-500/30' },
                    { l: '🚫 Dauerhaft bannen',     a: 'ban' as const,        c: 'text-red-400 bg-red-500/20 border-red-500/30' },
                  ].map((item) => (
                    <button key={item.a} onClick={() => doModAction(item.a)}
                      className={`w-full py-3 rounded-xl border font-semibold text-sm hover:opacity-80 transition-opacity ${item.c}`}>
                      {item.l}
                    </button>
                  ))}
                </div>
              ) : (
                <button onClick={() => doModAction('report')}
                  className="w-full py-3 rounded-xl border border-red-500/25 bg-red-500/15 text-red-300 font-semibold text-sm">
                  🚩 Nachricht melden
                </button>
              )}
              <button onClick={() => setSelectedMsg(null)} className="w-full mt-3 py-3 text-white/40 text-sm font-semibold">
                Abbrechen
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MOD PANEL (slide-in from right) ── */}
      <AnimatePresence>
        {showModPanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModPanel(false)} className="fixed inset-0 bg-black/50 z-[70]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[88vw] bg-brand-card border-l border-white/10 z-[71] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-12 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-purple-400" />
                  <h2 className="text-white font-bold">Mod-Panel</h2>
                </div>
                <button onClick={() => setShowModPanel(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                {(['settings', 'flagged', 'log'] as const).map((t) => (
                  <button key={t} onClick={() => setModTab(t)}
                    className={`flex-1 py-2.5 text-xs font-semibold transition-colors relative ${modTab === t ? 'text-purple-300' : 'text-white/40 hover:text-white/70'}`}>
                    {t === 'settings' && '⚙️ Tools'}
                    {t === 'flagged' && (
                      <span className="flex items-center justify-center gap-1">
                        🚩 Gemeldet{flagged.length > 0 && (
                          <span className="w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                            {flagged.length}
                          </span>
                        )}
                      </span>
                    )}
                    {t === 'log' && '📋 Log'}
                    {modTab === t && <motion.div layoutId="modtab-u" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 rounded-full" />}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">

                {/* ── Settings ── */}
                {modTab === 'settings' && (<>
                  {/* Slow mode */}
                  <div className="card-glass rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-yellow-400" />
                        <span className="text-white/80 text-sm font-semibold">Slow Mode</span>
                      </div>
                      <span className={`text-xs font-bold ${slowMode > 0 ? 'text-yellow-400' : 'text-white/30'}`}>{slowMode > 0 ? `${slowMode}s` : 'Aus'}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {([0, 5, 10, 30] as const).map((v) => (
                        <button key={v} onClick={() => { setSlowMode(v); logMod('slow_mode', `Slow Mode: ${v === 0 ? 'aus' : v + 's'}`); }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${slowMode === v ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}>
                          {v === 0 ? 'Aus' : `${v}s`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub-only */}
                  <div className="card-glass rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={13} className="text-blue-400" />
                      <div>
                        <p className="text-white/80 text-sm font-semibold">Sub-Only</p>
                        <p className="text-white/30 text-xs">Nur Abonnenten können chatten</p>
                      </div>
                    </div>
                    <button onClick={() => { setSubOnlyMode((v) => !v); logMod('sub_only', `Sub-Only: ${!subOnlyMode ? 'an' : 'aus'}`); }}
                      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${subOnlyMode ? 'bg-blue-500' : 'bg-white/20'}`}>
                      <motion.div animate={{ x: subOnlyMode ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                  </div>

                  {/* Word filter */}
                  <div className="card-glass rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Filter size={13} className="text-green-400" />
                        <div>
                          <p className="text-white/80 text-sm font-semibold">Wortfilter</p>
                          <p className="text-white/30 text-[10px]">Blockierte Wörter → [***]</p>
                        </div>
                      </div>
                      <button onClick={() => { setWordFilterOn((v) => !v); logMod('word_filter', `Wortfilter: ${!wordFilterOn ? 'an' : 'aus'}`); }}
                        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${wordFilterOn ? 'bg-green-500' : 'bg-white/20'}`}>
                        <motion.div animate={{ x: wordFilterOn ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                      </button>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <input value={newWord} onChange={(e) => setNewWord(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && newWord.trim()) { const w = newWord.trim().toLowerCase(); if (!blockedWords.includes(w)) { setBlockedWords((p) => [...p, w]); logMod('word_filter', `Wort "${w}" hinzugefügt`); } setNewWord(''); }}}
                        placeholder="Wort hinzufügen…"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-green-500/60" />
                      <button onClick={() => { const w = newWord.trim().toLowerCase(); if (w && !blockedWords.includes(w)) { setBlockedWords((p) => [...p, w]); logMod('word_filter', `Wort "${w}" hinzugefügt`); } setNewWord(''); }}
                        className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg px-3 py-1.5 text-xs font-bold">+</button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {blockedWords.map((w) => (
                        <span key={w} className="flex items-center gap-0.5 bg-red-500/15 border border-red-500/20 rounded-full px-2 py-0.5 text-red-300 text-[10px]">
                          {w}<button onClick={() => setBlockedWords((p) => p.filter((x) => x !== w))} className="text-red-400/50 hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Clear chat */}
                  <button onClick={() => { setMessages([]); logMod('clear_chat', 'Chat geleert'); setShowModPanel(false); }}
                    className="w-full py-3 rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 text-sm font-semibold flex items-center justify-center gap-2">
                    <Trash2 size={14} />Chat leeren
                  </button>

                  {/* Banned users */}
                  {bannedUsers.size > 0 && (
                    <div className="card-glass rounded-xl p-3">
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Ban size={11} />{bannedUsers.size} Gebannte Nutzer
                      </p>
                      {[...bannedUsers].map((uid) => (
                        <div key={uid} className="flex items-center justify-between py-1">
                          <span className="text-white/50 text-xs font-mono">{uid}</span>
                          <button onClick={() => { setBannedUsers((s) => { const n = new Set(s); n.delete(uid); return n; }); logMod('unban', `Ban für ${uid} aufgehoben`); }}
                            className="text-green-400 text-[10px] font-bold">Entbannen</button>
                        </div>
                      ))}
                    </div>
                  )}
                </>)}

                {/* ── Flagged tab ── */}
                {modTab === 'flagged' && (
                  flagged.length === 0
                    ? <div className="text-center py-10 text-white/30 text-sm"><ShieldCheck size={24} className="mx-auto mb-2 opacity-30" />Keine gemeldeten Nachrichten</div>
                    : flagged.map((msg) => (
                        <div key={msg.id} className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                          <p className="text-white/80 text-xs mb-1 line-clamp-2">{msg.text}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-red-400/60 text-[10px]">{msg.userName} · {msg.reportCount ?? 0} Meldungen</span>
                            <div className="flex gap-1.5">
                              <button onClick={() => { setSelectedMsg(msg); doModAction('delete'); }}
                                className="text-red-400 text-[10px] font-bold bg-red-500/20 px-2 py-0.5 rounded-full">Löschen</button>
                              <button onClick={() => setMessages((p) => p.map((m) => m.id === msg.id ? { ...m, flagged: false } : m))}
                                className="text-green-400 text-[10px] font-bold bg-green-500/20 px-2 py-0.5 rounded-full">OK</button>
                            </div>
                          </div>
                        </div>
                      ))
                )}

                {/* ── Log tab ── */}
                {modTab === 'log' && (
                  modLog.length === 0
                    ? <div className="text-center py-10 text-white/30 text-sm"><Activity size={24} className="mx-auto mb-2 opacity-30" />Noch keine Aktionen</div>
                    : modLog.map((entry) => (
                        <div key={entry.id} className="bg-white/3 border border-white/8 rounded-xl px-3 py-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-white/80 text-xs font-semibold">{MOD_LOG_LABELS[entry.type]}</p>
                              <p className="text-white/40 text-[10px] mt-0.5">{entry.detail}</p>
                            </div>
                            <span className="text-white/25 text-[10px] flex-shrink-0 ml-2">
                              {entry.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── GIFT TOASTS ── */}
      <LiveGiftToast
        items={giftToastItems}
        onExpire={(id) => setGiftToastItems((p) => p.filter((i) => i.id !== id))}
      />

      {/* ── FLOATING HEARTS ── */}
      <AnimatePresence>
        {floatingHearts.map((h) => (
          <motion.div key={h.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }} animate={{ opacity: 0, y: -150, scale: 1.2 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute z-40 pointer-events-none text-2xl" style={{ bottom: '45%', left: `${h.x}%` }}>
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── FLOATING GIFTS ── */}
      <AnimatePresence>
        {floatingGifts.map((g) => (
          <motion.div key={g.id}
            initial={{ opacity: 0, scale: 0.3, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.5, 1.5, 0.8], y: [-20, -40, -80, -120] }}
            exit={{ opacity: 0 }} transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute z-50 pointer-events-none text-6xl"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            {g.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] bg-brand-card border border-white/15 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-xl flex items-center gap-2">
            <Check size={14} className="text-green-400" />{toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
