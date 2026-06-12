'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Star, Zap, Crown, Gift } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useI18n } from '@/lib/i18n';

interface DayReward {
  day: number;
  reward: number;
  type: 'coins' | 'superlike' | 'boost' | 'premium';
  label: string;
  emoji: string;
}

const WEEKLY_REWARDS: DayReward[] = [
  { day: 1, reward: 20, type: 'coins', label: '20 Münzen', emoji: '🪙' },
  { day: 2, reward: 30, type: 'coins', label: '30 Münzen', emoji: '🪙' },
  { day: 3, reward: 1, type: 'superlike', label: '1 Super-Like', emoji: '⭐' },
  { day: 4, reward: 50, type: 'coins', label: '50 Münzen', emoji: '🪙' },
  { day: 5, reward: 75, type: 'coins', label: '75 Münzen', emoji: '🪙' },
  { day: 6, reward: 1, type: 'boost', label: '1 Boost', emoji: '⚡' },
  { day: 7, reward: 200, type: 'coins', label: '200 Münzen + 1 Premium Tag', emoji: '👑' },
];

const TASKS = [
  { id: 'swipe5', emoji: '💘', title: '5 Profile ansehen', desc: 'Swipe auf 5 Profile', progress: 3, total: 5, reward: 15, done: false },
  { id: 'message', emoji: '💬', title: 'Erste Nachricht senden', desc: 'Schreibe einem Match', progress: 0, total: 1, reward: 25, done: false },
  { id: 'complete_bio', emoji: '✍️', title: 'Profil vervollständigen', desc: 'Fülle alle Profilfelder aus', progress: 1, total: 1, reward: 50, done: true },
  { id: 'add_photo', emoji: '📸', title: '3 Fotos hochladen', desc: 'Füge mindestens 3 Fotos hinzu', progress: 3, total: 3, reward: 30, done: true },
  { id: 'verify', emoji: '✅', title: 'Profil verifizieren', desc: 'Bestätige deine Identität', progress: 0, total: 1, reward: 100, done: false },
];

export default function DailyPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [currentStreak] = useState(5);
  const [todaysClaimed, setTodaysClaimed] = useState(false);
  const [claimedTasks, setClaimedTasks] = useState<Set<string>>(new Set(['complete_bio', 'add_photo']));
  const [coins, setCoins] = useState(340);
  const [showRewardAnim, setShowRewardAnim] = useState<{ amount: number; emoji: string } | null>(null);

  const claimDaily = () => {
    if (todaysClaimed) return;
    setTodaysClaimed(true);
    const todayReward = WEEKLY_REWARDS[(currentStreak - 1) % 7];
    setCoins(c => c + todayReward.reward);
    setShowRewardAnim({ amount: todayReward.reward, emoji: todayReward.emoji });
    setTimeout(() => setShowRewardAnim(null), 2000);
  };

  const claimTask = (taskId: string, reward: number) => {
    if (claimedTasks.has(taskId)) return;
    setClaimedTasks(prev => new Set([...prev, taskId]));
    setCoins(c => c + reward);
    setShowRewardAnim({ amount: reward, emoji: '🪙' });
    setTimeout(() => setShowRewardAnim(null), 2000);
  };

  const todayDayIndex = (currentStreak - 1) % 7;

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <h1 className="text-white font-black text-xl">🎁 {t.daily.title}</h1>
          <div className="ml-auto flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-500/25 rounded-full px-3 py-1.5">
            <span className="text-sm">🪙</span>
            <span className="text-yellow-300 font-bold text-sm">{coins}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Streak hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-2xl p-5 text-center border border-orange-500/20">
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="text-5xl mb-2">🔥</motion.div>
          <p className="text-white font-black text-3xl">{t.daily.streak(currentStreak)}</p>
          <p className="text-white/50 text-sm mt-1">{t.daily.streakDesc}</p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {Array.from({ length: 7 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 20 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i < currentStreak ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/30'}`}
              >
                {i < currentStreak ? '🔥' : (i + 1)}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly rewards calendar */}
        <div>
          <h2 className="text-white font-bold text-base mb-3">{t.daily.thisWeek}</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKLY_REWARDS.map((wr, i) => {
              const isPast = i < currentStreak - 1;
              const isToday = i === todayDayIndex;
              const isFuture = i > todayDayIndex;
              return (
                <motion.div
                  key={wr.day}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${
                    isToday ? 'border-purple-500/60 bg-purple-500/15' :
                    isPast ? 'border-green-500/30 bg-green-500/8' :
                    'border-white/8 bg-white/3 opacity-50'
                  }`}
                >
                  <span className="text-base">{wr.emoji}</span>
                  <p className={`text-[9px] font-bold ${isToday ? 'text-purple-300' : isPast ? 'text-green-400' : 'text-white/30'}`}>
                    {isPast ? '✓' : `T${wr.day}`}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Today's claim */}
        <div className="card-glass rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{WEEKLY_REWARDS[todayDayIndex].emoji}</span>
            <div>
              <p className="text-white font-black text-lg">{t.daily.todayReward}</p>
              <p className="text-purple-300 font-semibold">{WEEKLY_REWARDS[todayDayIndex].label}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={claimDaily}
            disabled={todaysClaimed}
            className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all ${todaysClaimed ? 'bg-green-500' : 'gradient-brand glow-button'}`}
          >
            {todaysClaimed ? <><Check size={18} /> {t.daily.claimed}</> : <><Gift size={18} /> {t.daily.claim}</>}
          </motion.button>
        </div>

        {/* Daily tasks */}
        <div>
          <h2 className="text-white font-bold text-base mb-3">{t.daily.dailyTasks}</h2>
          <div className="space-y-3">
            {TASKS.map((task, i) => {
              const isClaimed = claimedTasks.has(task.id);
              const isCompletable = task.done && !isClaimed;
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`card-glass rounded-2xl p-4 border ${isClaimed ? 'border-green-500/25' : 'border-white/8'}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl flex-shrink-0">{task.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">{task.title}</p>
                      <p className="text-white/40 text-xs">{task.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-yellow-400 text-sm">🪙</span>
                      <span className="text-yellow-300 font-bold text-sm">+{task.reward}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/40">{task.progress}/{task.total}</span>
                      <span className="text-white/40">{Math.round((task.progress / task.total) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(task.progress / task.total) * 100}%` }}
                        transition={{ delay: i * 0.06 + 0.3, duration: 0.7 }}
                        className={`h-full rounded-full ${isClaimed ? 'bg-green-500' : 'gradient-brand'}`}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => claimTask(task.id, task.reward)}
                    disabled={!isCompletable}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${
                      isClaimed ? 'bg-green-500/15 text-green-400 border border-green-500/25' :
                      isCompletable ? 'gradient-brand text-white glow-button' :
                      'bg-white/5 text-white/25 border border-white/8'
                    }`}
                  >
                    {isClaimed ? <><Check size={14} /> {t.daily.collected}</> :
                     isCompletable ? <><Star size={14} /> {t.daily.collectReward}</> :
                     <>{t.daily.doTask(task.progress, task.total)}</>}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Premium boost */}
        <div className="card-glass rounded-2xl p-4 border border-yellow-500/15 flex items-center gap-3">
          <Crown size={20} className="text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-white font-bold text-sm">{t.daily.premiumBoost}</p>
            <p className="text-white/40 text-xs">{t.daily.premiumDesc}</p>
          </div>
          <button onClick={() => router.push('/premium')} className="gradient-brand text-white text-xs font-bold px-3 py-2 rounded-xl">{t.daily.goGold}</button>
        </div>
      </div>

      {/* Reward animation */}
      <AnimatePresence>
        {showRewardAnim && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-white px-6 py-3 rounded-2xl font-black text-lg shadow-2xl flex items-center gap-2"
            style={{ boxShadow: '0 0 40px rgba(234,179,8,0.5)' }}
          >
            {t.daily.received(showRewardAnim.emoji, showRewardAnim.amount)}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
