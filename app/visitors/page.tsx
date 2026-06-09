'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, Lock, Sparkles, TrendingUp } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { mockVisitors, mockMatches, formatRelativeTime, goalColors, goalEmojis } from '@/lib/mockData';

export default function VisitorsPage() {
  const [likedBack, setLikedBack] = useState<Set<string>>(new Set());
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const unreadMatches = mockMatches.filter((m) => m.unreadCount > 0).length;
  const newVisitors = mockVisitors.filter((v) => Date.now() - v.visitedAt.getTime() < 86400000).length;

  // Free users can only see the first 3 visitors
  const freeLimit = 3;
  const visibleVisitors = mockVisitors.slice(0, freeLimit);
  const lockedVisitors = mockVisitors.slice(freeLimit);

  const todayVisitors = mockVisitors.filter(
    (v) => Date.now() - v.visitedAt.getTime() < 86400000
  ).length;

  const handleLikeBack = (userId: string) => {
    setLikedBack((prev) => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
  };

  // Stats
  const weeklyViews = mockVisitors.length + 7;
  const growthPercent = 24;

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-black text-xl">Profile Visitors</h1>
            {newVisitors > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="gradient-brand text-white text-xs font-bold px-2.5 py-1 rounded-full"
              >
                {newVisitors} new
              </motion.span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-28">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mt-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-glass rounded-2xl p-3 text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye size={14} className="text-purple-400" />
            </div>
            <p className="text-white font-bold text-xl">{mockVisitors.length}</p>
            <p className="text-white/40 text-[10px]">Total Views</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-glass rounded-2xl p-3 text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles size={14} className="text-yellow-400" />
            </div>
            <p className="text-white font-bold text-xl">{todayVisitors}</p>
            <p className="text-white/40 text-[10px]">Today</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-glass rounded-2xl p-3 text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp size={14} className="text-green-400" />
            </div>
            <p className="text-green-400 font-bold text-xl">+{growthPercent}%</p>
            <p className="text-white/40 text-[10px]">This week</p>
          </motion.div>
        </div>

        {/* Boost profile banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gradient-brand rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-lg"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Boost your profile</p>
            <p className="text-white/80 text-xs mt-0.5">Get 10x more views in the next hour</p>
          </div>
          <button className="bg-white text-purple-700 text-xs font-black px-4 py-2 rounded-xl hover:bg-white/90 transition-colors flex-shrink-0">
            Boost
          </button>
        </motion.div>

        {/* Section label */}
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">
          Recent Visitors
        </p>

        {/* Visible visitors */}
        <div className="space-y-3">
          {visibleVisitors.map((visitor, i) => {
            const isLikedBack = likedBack.has(visitor.user.id);
            const isMatch = mockMatches.some((m) => m.user.id === visitor.user.id);

            return (
              <motion.div
                key={visitor.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.2 }}
                className="flex items-center gap-4 p-4 card-glass rounded-2xl"
              >
                {/* Photo */}
                <div className="relative flex-shrink-0">
                  <img
                    src={visitor.user.photos[0]}
                    alt={visitor.user.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  {visitor.user.online && (
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-brand-card" />
                  )}
                  {/* New indicator for recent visitors */}
                  {Date.now() - visitor.visitedAt.getTime() < 3600000 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      new
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-semibold">{visitor.user.name}</span>
                    <span className="text-white/60 text-sm">{visitor.user.age}</span>
                    {visitor.user.verified && (
                      <span className="text-blue-400 text-xs">✓</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${goalColors[visitor.user.relationshipGoal]}`}>
                      {goalEmojis[visitor.user.relationshipGoal]}
                      {visitor.user.relationshipGoal}
                    </span>
                  </div>

                  <p className="text-white/40 text-xs">
                    Visited {formatRelativeTime(visitor.visitedAt)}
                  </p>
                </div>

                {/* Action */}
                <div className="flex-shrink-0">
                  {isMatch ? (
                    <span className="text-xs text-purple-400 font-semibold bg-purple-500/20 px-3 py-2 rounded-xl border border-purple-500/30">
                      Matched ❤️
                    </span>
                  ) : isLikedBack ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs text-green-400 font-semibold bg-green-500/20 px-3 py-2 rounded-xl border border-green-500/30"
                    >
                      Liked ✓
                    </motion.span>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLikeBack(visitor.user.id)}
                      className="gradient-brand text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-lg"
                    >
                      <Heart size={12} fill="white" />
                      Like
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Locked visitors (premium blur) */}
        {lockedVisitors.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 relative"
          >
            <div className="space-y-3">
              {lockedVisitors.map((visitor, i) => (
                <div
                  key={visitor.user.id}
                  className="flex items-center gap-4 p-4 card-glass rounded-2xl blur-sm select-none pointer-events-none"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-surface" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-brand-surface rounded mb-2" />
                    <div className="h-3 w-16 bg-brand-surface rounded" />
                  </div>
                  <div className="w-16 h-8 bg-brand-surface rounded-xl" />
                </div>
              ))}
            </div>

            {/* Unlock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl">
              <div
                className="card-glass rounded-2xl p-5 text-center mx-4 border border-purple-500/30"
                onClick={() => setShowPremiumModal(true)}
              >
                <Lock size={28} className="text-purple-400 mx-auto mb-2" />
                <p className="text-white font-bold text-base mb-1">
                  +{lockedVisitors.length} more visitors
                </p>
                <p className="text-white/50 text-xs mb-3">
                  Upgrade to Premium to see everyone who viewed your profile
                </p>
                <button className="gradient-brand text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                  Unlock All ✨
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Activity hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 card-glass rounded-2xl p-4"
        >
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-400" />
            Profile Activity
          </h3>
          <div className="space-y-2.5">
            {[
              { label: 'Profile views this week', value: weeklyViews, max: 50 },
              { label: 'Likes received', value: 12, max: 50 },
              { label: 'Super likes', value: 3, max: 20 },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{stat.label}</span>
                  <span className="text-purple-400 font-semibold">{stat.value}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                    className="h-full gradient-brand rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav matchCount={unreadMatches} visitorCount={newVisitors} />
    </div>
  );
}
