'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, Users, ChevronRight, Trophy, Gift, Share2, Crown } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { rewardTiers, invitedFriends } from '@/lib/discountsData';

const REFERRAL_CODE = 'ALEX-XK92';
const REFERRAL_LINK = 'https://aura.app/join?ref=ALEX-XK92';
const MOCK_INVITE_COUNT = 3;

const LEADERBOARD = [
  { rank: 1, name: 'Sara K.', invites: 47, reward: '3 Monate Gold', emoji: '👑' },
  { rank: 2, name: 'Max B.', invites: 32, reward: '2 Monate Gold', emoji: '🥈' },
  { rank: 3, name: 'Jana M.', invites: 28, reward: '1 Monat Gold', emoji: '🥉' },
  { rank: 4, name: 'Du', invites: MOCK_INVITE_COUNT, reward: '—', emoji: '🫵', isMe: true },
];

const ACTIVITY = [
  { text: 'Lukas hat sich mit deinem Code angemeldet', time: '2h', emoji: '🎉' },
  { text: 'Du hast 50 Münzen verdient', time: '2h', emoji: '🪙' },
  { text: 'Klara hat sich mit deinem Code angemeldet', time: '1T', emoji: '🎉' },
  { text: 'Du hast Stufe 2 erreicht!', time: '3T', emoji: '🏆' },
];

type ToastType = { message: string; id: number; color?: string };

function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const show = (message: string, color = 'bg-green-500') => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, id, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500);
  };
  return { toasts, show };
}

export default function InvitePage() {
  const router = useRouter();
  const { toasts, show: showToast } = useToast();
  const [claimed, setClaimed] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'rewards' | 'leaderboard' | 'activity'>('rewards');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    showToast(`${label} kopiert! 📋`, 'bg-purple-600');
  };

  const claimReward = (friends: number) => {
    setClaimed(prev => new Set([...prev, friends]));
    showToast('Belohnung eingelöst! 🎁');
  };

  const joinedCount = invitedFriends.filter(f => f.status === 'joined').length;
  const nextTier = rewardTiers.find(t => !t.unlocked);
  const progressToNext = nextTier ? Math.min(100, (MOCK_INVITE_COUNT / nextTier.friends) * 100) : 100;

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <h1 className="text-white font-black text-xl">🎁 Freunde einladen</h1>
        </div>
        {/* Tabs */}
        <div className="flex gap-1">
          {([['rewards', '🏅 Belohnungen'], ['leaderboard', '🏆 Rangliste'], ['activity', '⚡ Aktivität']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab ? 'gradient-brand text-white' : 'bg-white/5 text-white/40'}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">

        {/* Hero + referral code */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-2xl p-5 border border-purple-500/20">
          <div className="text-center mb-4">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} className="text-5xl mb-2">🎁</motion.div>
            <h2 className="text-white font-black text-lg">Lade Freunde ein & verdiene</h2>
            <p className="text-white/50 text-xs mt-1">Beide erhalten Belohnungen wenn dein Freund beitritt</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[{ label: 'Eingeladen', value: MOCK_INVITE_COUNT, emoji: '👥' }, { label: 'Verdient', value: '50 🪙', emoji: '💰' }, { label: 'Aktive Stufe', value: 'Stufe 2', emoji: '🏆' }].map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                <p className="text-white font-black text-sm">{s.value}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Code */}
          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Dein Einladungscode</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3">
              <span className="text-white font-black text-xl tracking-widest font-mono">{REFERRAL_CODE}</span>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(REFERRAL_CODE, 'Code')} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-500' : 'gradient-brand'}`}>
              {copied ? <Check size={18} className="text-white" /> : <Copy size={18} className="text-white" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Link kopieren', emoji: '🔗', action: () => copyToClipboard(REFERRAL_LINK, 'Link'), color: 'border-purple-500/25' },
            { label: 'WhatsApp', emoji: '💬', action: () => showToast('Über WhatsApp geteilt!'), color: 'border-green-500/25' },
            { label: 'Instagram', emoji: '📸', action: () => showToast('Story erstellt!'), color: 'border-pink-500/25' },
            { label: 'Code teilen', emoji: '📤', action: () => copyToClipboard(REFERRAL_CODE, 'Code'), color: 'border-blue-500/25' },
          ].map(btn => (
            <motion.button key={btn.label} whileTap={{ scale: 0.95 }} onClick={btn.action} className={`card-glass rounded-2xl p-3.5 flex items-center gap-3 border ${btn.color}`}>
              <span className="text-2xl">{btn.emoji}</span>
              <span className="text-white font-semibold text-sm">{btn.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'rewards' && (
            <motion.div key="rewards" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="space-y-4">
              {/* Progress to next tier */}
              {nextTier && (
                <div className="card-glass rounded-2xl p-4 border border-purple-500/15">
                  <div className="flex justify-between text-xs text-white/50 mb-2">
                    <span>{joinedCount} Freunde beigetreten</span>
                    <span>{nextTier.friends - MOCK_INVITE_COUNT} bis zur nächsten Stufe</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }} className="h-full gradient-brand rounded-full" />
                  </div>
                </div>
              )}

              {/* Reward tiers */}
              <div className="space-y-3">
                {rewardTiers.map((tier, idx) => {
                  const isUnlocked = tier.unlocked;
                  const isClaimed = claimed.has(tier.friends);
                  const isClaimable = isUnlocked && !isClaimed;
                  return (
                    <motion.div key={tier.friends} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06, type: 'spring', stiffness: 280, damping: 24 }} className={`card-glass rounded-2xl p-4 border ${isUnlocked ? 'border-green-500/30' : 'border-white/8 opacity-60'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${isUnlocked ? 'bg-green-500/15' : 'bg-white/5'}`}>{tier.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-white font-bold text-sm">{tier.friends} {tier.friends === 1 ? 'Freund' : 'Freunde'}</p>
                            {isUnlocked && !isClaimed && <span className="bg-green-500/20 text-green-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-green-500/30">Freigeschaltet</span>}
                            {isClaimed && <span className="bg-white/10 text-white/40 text-[9px] font-black px-1.5 py-0.5 rounded-full">Eingelöst</span>}
                            {!isUnlocked && <span className="text-white/30 text-[9px]">🔒 Gesperrt</span>}
                          </div>
                          <p className={`text-sm ${isUnlocked ? 'text-white/80' : 'text-white/40'}`}>{tier.reward}</p>
                        </div>
                        {isClaimable && (
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => claimReward(tier.friends)} className="gradient-brand text-white text-xs font-black px-3 py-2 rounded-xl glow-button">Einlösen</motion.button>
                        )}
                        {isClaimed && <Check size={18} className="text-green-400 flex-shrink-0" />}
                      </div>
                      {!isUnlocked && (
                        <div className="mt-3">
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full gradient-brand rounded-full" style={{ width: `${Math.min(100, (MOCK_INVITE_COUNT / tier.friends) * 100)}%` }} />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Invited friends list */}
              <div>
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Users size={14} className="text-purple-400" />Eingeladene Freunde</h3>
                <div className="space-y-2">
                  {invitedFriends.map((friend, i) => {
                    const isPending = friend.status === 'pending';
                    return (
                      <motion.div key={`${friend.name}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`card-glass rounded-xl p-3 flex items-center gap-3 border ${isPending ? 'border-white/5 opacity-60' : 'border-green-500/15'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${isPending ? 'bg-white/5' : 'bg-green-500/10'}`}>{friend.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm ${isPending ? 'text-white/50' : 'text-white'}`}>{friend.name}</p>
                          <p className={`text-xs ${isPending ? 'text-white/30' : 'text-white/50'}`}>
                            {isPending ? 'Wartet auf Beitritt…' : `Beigetreten ${friend.joinedAt.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}`}
                          </p>
                        </div>
                        {!isPending && <span className="text-green-400 text-xs font-bold">+{friend.rewardEarned}</span>}
                        {isPending && <span className="text-white/25 text-xs">Ausstehend</span>}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* How it works */}
              <div className="card-glass rounded-2xl p-4 border border-white/8">
                <h3 className="text-white font-bold text-sm mb-3">So funktioniert es</h3>
                {[
                  { n: '1', emoji: '📤', title: 'Code teilen', desc: 'Sende deinen einzigartigen Code oder Link an Freunde.' },
                  { n: '2', emoji: '👤', title: 'Freund tritt bei', desc: 'Dein Freund meldet sich mit deinem Code an.' },
                  { n: '3', emoji: '🎁', title: 'Beide werden belohnt', desc: 'Du verdienst Münzen & Stufenfortschritt. Dein Freund erhält einen Willkommensbonus.' },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-3 mb-3 last:mb-0">
                    <div className="w-7 h-7 gradient-brand rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0">{s.n}</div>
                    <div>
                      <p className="text-white font-semibold text-sm">{s.emoji} {s.title}</p>
                      <p className="text-white/50 text-xs mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="space-y-3">
              <p className="text-white/40 text-xs text-center">Diese Woche — Wer lädt am meisten ein?</p>
              {/* Top 3 podium */}
              <div className="flex items-end justify-center gap-3 pt-2 pb-4">
                {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((entry, idx) => {
                  const heights = ['h-20', 'h-28', 'h-16'];
                  const sizes = ['w-14', 'w-16', 'w-14'];
                  return (
                    <motion.div key={entry.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, type: 'spring', stiffness: 280, damping: 24 }} className="flex flex-col items-center gap-1">
                      <span className="text-2xl">{entry.emoji}</span>
                      <p className="text-white text-xs font-bold">{entry.name}</p>
                      <p className="text-white/50 text-[10px]">{entry.invites} Einladungen</p>
                      <div className={`${sizes[idx]} ${heights[idx]} gradient-brand rounded-t-xl flex items-center justify-center`}>
                        <span className="text-white font-black text-lg">#{entry.rank}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Full list */}
              <div className="space-y-2">
                {LEADERBOARD.map((entry, i) => (
                  <motion.div key={entry.rank} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 24 }} className={`card-glass rounded-xl p-4 flex items-center gap-3 border ${entry.isMe ? 'border-purple-500/40' : 'border-white/8'}`}>
                    <span className="text-xl w-8 text-center">{entry.emoji}</span>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${entry.isMe ? 'text-purple-300' : 'text-white'}`}>{entry.name} {entry.isMe && <span className="text-[10px] text-purple-400 font-normal">(Du)</span>}</p>
                      <p className="text-white/40 text-xs">{entry.reward}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-black text-base">{entry.invites}</p>
                      <p className="text-white/30 text-[10px]">Einladungen</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="card-glass rounded-xl p-3 border border-yellow-500/20 flex items-center gap-3">
                <Crown size={16} className="text-yellow-400 flex-shrink-0" />
                <p className="text-yellow-300 text-xs">Platz 1 gewinnt 3 Monate Premium Gold gratis!</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div key="activity" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="space-y-2">
              {ACTIVITY.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card-glass rounded-xl p-3.5 flex items-center gap-3 border border-white/8">
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <p className="text-white/70 text-sm flex-1">{item.text}</p>
                  <span className="text-white/30 text-xs">{item.time}</span>
                </motion.div>
              ))}
              {ACTIVITY.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">⚡</p>
                  <p className="text-white/50 text-sm">Noch keine Aktivität.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discounts link */}
        <motion.div whileTap={{ scale: 0.98 }} onClick={() => router.push('/discounts')} className="card-glass rounded-2xl p-4 border border-purple-500/15 flex items-center gap-4 cursor-pointer">
          <div className="text-2xl">🏷️</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Rabatte & Gutscheine</p>
            <p className="text-white/50 text-xs">Alle aktiven Angebote ansehen</p>
          </div>
          <ChevronRight size={16} className="text-white/30" />
        </motion.div>

        <p className="text-white/20 text-[10px] text-center leading-relaxed">
          Belohnungen werden nach verifizierter Anmeldung des Freundes gewährt. Prämien sind nicht übertragbar und können nicht mit anderen Angeboten kombiniert werden.
        </p>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.9 }} className={`${t.color || 'bg-green-500'} text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2`}>
              <Check size={15} />
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
