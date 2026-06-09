'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Copy, Check, Users, ChevronRight,
} from 'lucide-react';
import { rewardTiers, invitedFriends } from '@/lib/discountsData';

const REFERRAL_CODE = 'ALEX-XK92';
const REFERRAL_LINK = 'https://discordium.app/join?ref=ALEX-XK92';
const MOCK_INVITE_COUNT = 3;

type ToastType = { message: string; id: number };

function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const show = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  };
  return { toasts, show };
}

export default function InvitePage() {
  const router = useRouter();
  const { toasts, show: showToast } = useToast();
  const [claimed, setClaimed] = useState<Set<number>>(new Set());

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied!`);
    } catch {
      showToast(`${label} copied!`);
    }
  };

  const shareAction = (method: string) => {
    showToast(`Shared via ${method}!`);
  };

  const claimReward = (friends: number) => {
    setClaimed((prev) => {
      const next = new Set(prev);
      next.add(friends);
      return next;
    });
    showToast('Reward claimed! 🎉');
  };

  const joinedCount = invitedFriends.filter((f) => f.status === 'joined').length;
  const nextTier = rewardTiers.find((t) => !t.unlocked);
  const progressToNext = nextTier
    ? Math.min(100, (MOCK_INVITE_COUNT / nextTier.friends) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-purple-400" />
            <h1 className="text-white font-black text-xl">Invite Friends 👥</h1>
          </div>
        </div>
      </div>

      <div className="px-5 pb-24 pt-5 space-y-6">

        {/* ── Hero section ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-white font-black text-2xl mb-2">Earn rewards for every friend you invite</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Share your code, your friend joins Discordium, and you both get rewarded. Easy as that.
          </p>
        </motion.div>

        {/* ── Referral code box ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass rounded-2xl p-5 border border-purple-500/20"
        >
          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Your Referral Code</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3">
              <span className="text-white font-black text-xl tracking-widest font-mono">{REFERRAL_CODE}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => copyToClipboard(REFERRAL_CODE, 'Code')}
              className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <Copy size={18} className="text-white" />
            </motion.button>
          </div>
        </motion.div>

        {/* ── Share buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { label: 'Copy Link', emoji: '🔗', action: () => copyToClipboard(REFERRAL_LINK, 'Link') },
            { label: 'WhatsApp', emoji: '💬', action: () => shareAction('WhatsApp') },
            { label: 'Send Email', emoji: '📧', action: () => shareAction('Email') },
            { label: 'Share Code', emoji: '📤', action: () => copyToClipboard(REFERRAL_CODE, 'Code') },
          ].map((btn) => (
            <motion.button
              key={btn.label}
              whileTap={{ scale: 0.95 }}
              onClick={btn.action}
              className="card-glass rounded-2xl p-4 flex items-center gap-3 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <span className="text-2xl">{btn.emoji}</span>
              <span className="text-white font-semibold text-sm">{btn.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Invited', value: MOCK_INVITE_COUNT, emoji: '👥' },
            { label: 'Earned', value: '€12', emoji: '💰' },
            { label: 'Active Tier', value: 'Tier 2', emoji: '🏆' },
          ].map((stat) => (
            <div key={stat.label} className="card-glass rounded-2xl p-3 text-center border border-white/10">
              <div className="text-xl mb-1">{stat.emoji}</div>
              <p className="text-white font-black text-base">{stat.value}</p>
              <p className="text-white/40 text-[10px]">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Reward Tiers ── */}
        <div>
          <h2 className="text-white font-black text-base mb-1 flex items-center gap-2">
            🏅 Reward Tiers
          </h2>
          {nextTier && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-white/50 mb-1">
                <span>{joinedCount} friends joined</span>
                <span>{nextTier.friends} to unlock next</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                />
              </div>
            </div>
          )}
          <div className="space-y-3">
            {rewardTiers.map((tier, idx) => {
              const isUnlocked = tier.unlocked;
              const isClaimed = claimed.has(tier.friends);
              const isClaimable = isUnlocked && idx === 1 && !isClaimed; // tier 2 claimable
              return (
                <motion.div
                  key={tier.friends}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`card-glass rounded-2xl p-4 border ${
                    isUnlocked ? 'border-green-500/30' : 'border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      isUnlocked ? 'bg-green-500/20' : 'bg-white/5'
                    }`}>
                      {tier.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-bold text-sm">
                          {tier.friends} {tier.friends === 1 ? 'friend' : 'friends'}
                        </p>
                        {isUnlocked && !isClaimed && (
                          <span className="bg-green-500/20 text-green-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-green-500/30">
                            Unlocked
                          </span>
                        )}
                        {isClaimed && (
                          <span className="bg-white/10 text-white/40 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                            Claimed
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="text-white/30 text-[9px]">🔒 Locked</span>
                        )}
                      </div>
                      <p className={`text-sm ${isUnlocked ? 'text-white/80' : 'text-white/40'}`}>
                        {tier.reward}
                      </p>
                    </div>
                    {isClaimable && (
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => claimReward(tier.friends)}
                        className="flex-shrink-0 gradient-brand text-white text-xs font-black px-3 py-2 rounded-xl"
                      >
                        Claim
                      </motion.button>
                    )}
                    {isClaimed && (
                      <Check size={18} className="text-green-400 flex-shrink-0" />
                    )}
                  </div>

                  {/* Progress toward this tier */}
                  {!isUnlocked && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-white/30 mb-1">
                        <span>{MOCK_INVITE_COUNT} / {tier.friends} friends</span>
                        <span>{tier.friends - MOCK_INVITE_COUNT} more to go</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${Math.min(100, (MOCK_INVITE_COUNT / tier.friends) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Friends List ── */}
        <div>
          <h2 className="text-white font-black text-base mb-3 flex items-center gap-2">
            <Users size={16} className="text-purple-400" />
            Your Invited Friends
          </h2>
          <div className="space-y-2">
            {invitedFriends.map((friend, i) => {
              const isPending = friend.status === 'pending';
              return (
                <motion.div
                  key={`${friend.name}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card-glass rounded-2xl p-4 flex items-center gap-4 border ${
                    isPending ? 'border-white/5 opacity-60' : 'border-green-500/15'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    isPending ? 'bg-white/5' : 'bg-green-500/10'
                  }`}>
                    {friend.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${isPending ? 'text-white/50' : 'text-white'}`}>
                      {friend.name}
                    </p>
                    <p className={`text-xs mt-0.5 ${isPending ? 'text-white/30' : 'text-white/50'}`}>
                      {isPending
                        ? 'Waiting to join...'
                        : `Joined ${friend.joinedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                      }
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {isPending ? (
                      <span className="text-white/30 text-xs">Pending</span>
                    ) : (
                      <>
                        <p className="text-green-400 text-xs font-bold">+{friend.rewardEarned}</p>
                        <Check size={12} className="text-green-400 ml-auto mt-0.5" />
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="card-glass rounded-2xl p-5 border border-white/10">
          <h3 className="text-white font-bold text-sm mb-4">How It Works</h3>
          {[
            { step: '1', emoji: '📤', title: 'Share your code', desc: 'Send your unique referral code or link to a friend.' },
            { step: '2', emoji: '👤', title: 'Friend joins', desc: 'Your friend signs up using your code or link.' },
            { step: '3', emoji: '🎁', title: 'Both get rewarded', desc: 'You earn coins & tier progress. They get a welcome bonus.' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-4 mb-4 last:mb-0">
              <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {s.step}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{s.emoji} {s.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Discounts link ── */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/discounts')}
          className="card-glass rounded-2xl p-4 border border-purple-500/20 flex items-center gap-4 cursor-pointer"
        >
          <div className="text-2xl">🏷️</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Deals & Coupons</p>
            <p className="text-white/50 text-xs">See all active discounts and promo codes</p>
          </div>
          <ChevronRight size={16} className="text-white/30" />
        </motion.div>

        {/* ── Terms ── */}
        <p className="text-white/20 text-[10px] text-center leading-relaxed">
          Rewards are granted upon friend&apos;s verified registration. Referral rewards are non-transferable and may not be combined with other offers. Discordium reserves the right to modify the program at any time.
        </p>

      </div>

      {/* ── Toast notifications ── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
            >
              <Check size={15} />
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
