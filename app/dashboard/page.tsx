'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Settings, RefreshCw, Zap, Flag, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import SwipeCard from '@/components/SwipeCard';
import ReportModal from '@/components/ReportModal';
import { mockUsers, mockMatches, mockVisitors } from '@/lib/mockData';
import { liveStreams, formatViewerCount } from '@/lib/liveData';

type SwipeResult = 'like' | 'nope' | 'superlike';

interface SwipeHistoryItem {
  userId: string;
  result: SwipeResult;
}

export default function DashboardPage() {
  const router = useRouter();
  const [cardStack, setCardStack] = useState([...mockUsers]);
  const [swipeHistory, setSwipeHistory] = useState<SwipeHistoryItem[]>([]);
  const [lastSwipe, setLastSwipe] = useState<{ name: string; result: SwipeResult } | null>(null);
  const [showMatchModal, setShowMatchModal] = useState<typeof mockUsers[0] | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const unreadMatches = mockMatches.filter((m) => m.unreadCount > 0).length;
  const newVisitors = mockVisitors.filter((v) => {
    const diff = Date.now() - v.visitedAt.getTime();
    return diff < 1000 * 60 * 60 * 24; // last 24h
  }).length;

  const handleSwipeLeft = useCallback(() => {
    if (cardStack.length === 0) return;
    const user = cardStack[cardStack.length - 1];
    setSwipeHistory((prev) => [...prev, { userId: user.id, result: 'nope' }]);
    setLastSwipe({ name: user.name, result: 'nope' });
    setCardStack((prev) => prev.slice(0, -1));
    setTimeout(() => setLastSwipe(null), 1500);
  }, [cardStack]);

  const handleSwipeRight = useCallback(() => {
    if (cardStack.length === 0) return;
    const user = cardStack[cardStack.length - 1];
    setSwipeHistory((prev) => [...prev, { userId: user.id, result: 'like' }]);
    setLastSwipe({ name: user.name, result: 'like' });
    setCardStack((prev) => prev.slice(0, -1));
    setTimeout(() => setLastSwipe(null), 1500);

    // 30% chance of match
    if (Math.random() < 0.3) {
      setTimeout(() => setShowMatchModal(user), 400);
    }
  }, [cardStack]);

  const handleSuperLike = useCallback(() => {
    if (cardStack.length === 0) return;
    const user = cardStack[cardStack.length - 1];
    setSwipeHistory((prev) => [...prev, { userId: user.id, result: 'superlike' }]);
    setLastSwipe({ name: user.name, result: 'superlike' });
    setCardStack((prev) => prev.slice(0, -1));
    setTimeout(() => setLastSwipe(null), 1500);

    // 60% chance of match on super like
    if (Math.random() < 0.6) {
      setTimeout(() => setShowMatchModal(user), 400);
    }
  }, [cardStack]);

  const handleUndo = () => {
    if (swipeHistory.length === 0) return;
    const last = swipeHistory[swipeHistory.length - 1];
    const user = mockUsers.find((u) => u.id === last.userId);
    if (user) {
      setCardStack((prev) => [...prev, user]);
      setSwipeHistory((prev) => prev.slice(0, -1));
    }
  };

  const resetCards = () => {
    setCardStack([...mockUsers]);
    setSwipeHistory([]);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-brand rounded-xl flex items-center justify-center">
            <Flame size={18} className="text-white" fill="white" />
          </div>
          <h1 className="text-white font-black text-xl">Discover</h1>
        </div>
        <div className="flex items-center gap-2">
          {swipeHistory.length > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleUndo}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-yellow-400 hover:bg-yellow-500/10 transition-colors"
              title="Undo last swipe"
            >
              <RefreshCw size={16} />
            </motion.button>
          )}
          <button className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Live Now Strip */}
      <div className="px-5 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-2 h-2 rounded-full bg-red-500 inline-block"
          />
          <span className="text-white/70 text-xs font-semibold">Live Now</span>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {liveStreams.slice(0, 6).map((stream) => (
            <motion.button
              key={stream.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => router.push(`/live/${stream.id}`)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red-500 p-0.5 bg-brand-card">
                  <img
                    src={stream.hostPhoto}
                    alt={stream.hostName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-[-2px] rounded-full border-2 border-red-500 pointer-events-none"
                />
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-sm leading-none">
                  LIVE
                </span>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-[10px] font-semibold leading-none">{stream.hostName}</p>
                <p className="text-white/40 text-[9px] flex items-center gap-0.5 justify-center mt-0.5">
                  <Eye size={8} />
                  {formatViewerCount(stream.viewerCount)}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Swipe Result Notification */}
      <AnimatePresence>
        {lastSwipe && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-0 right-0 flex justify-center z-20 pointer-events-none"
          >
            <div className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-xl ${
              lastSwipe.result === 'like'
                ? 'bg-green-500 text-white'
                : lastSwipe.result === 'superlike'
                ? 'bg-blue-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {lastSwipe.result === 'like' && `❤️ You liked ${lastSwipe.name}!`}
              {lastSwipe.result === 'nope' && `✕ Passed on ${lastSwipe.name}`}
              {lastSwipe.result === 'superlike' && `⭐ Super liked ${lastSwipe.name}!`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Stack */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {cardStack.length > 0 ? (
          <div className="relative w-full" style={{ height: '520px' }}>
            {/* Report button */}
            <button
              onClick={() => setShowReportModal(true)}
              className="absolute top-2 right-2 z-30 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/60 hover:text-red-400 hover:border-red-400/40 transition-colors"
              title="Report user"
            >
              <Flag size={15} />
            </button>
            {/* Show up to 3 cards */}
            {cardStack.slice(-3).map((user, index, arr) => {
              const isTop = index === arr.length - 1;
              const stackPos = arr.length - 1 - index;

              return (
                <motion.div
                  key={user.id}
                  className="absolute inset-0"
                  style={{
                    zIndex: index,
                    transform: isTop
                      ? 'none'
                      : `scale(${1 - stackPos * 0.04}) translateY(${stackPos * 12}px)`,
                  }}
                >
                  <SwipeCard
                    user={user}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onSuperLike={handleSuperLike}
                    isTop={isTop}
                    zIndex={index}
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Empty state
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center px-6"
          >
            <div className="w-24 h-24 gradient-brand/20 border border-purple-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Zap size={40} className="text-purple-400" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">You&apos;ve seen everyone!</h3>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              Check back later for new profiles, or expand your search settings to find more people.
            </p>
            <button
              onClick={resetCards}
              className="gradient-brand text-white font-bold px-8 py-3 rounded-2xl glow-purple hover:opacity-90 transition-opacity"
            >
              Refresh Profiles
            </button>
          </motion.div>
        )}
      </div>

      {/* Stats bar */}
      {cardStack.length > 0 && (
        <div className="px-5 pb-2 flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-white/40 text-xs">Remaining</p>
            <p className="text-white font-bold">{cardStack.length}</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-white/40 text-xs">Liked</p>
            <p className="text-green-400 font-bold">
              {swipeHistory.filter((s) => s.result === 'like' || s.result === 'superlike').length}
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-white/40 text-xs">Passed</p>
            <p className="text-white/60 font-bold">
              {swipeHistory.filter((s) => s.result === 'nope').length}
            </p>
          </div>
        </div>
      )}

      <BottomNav matchCount={unreadMatches} visitorCount={newVisitors} />

      {/* Match Modal */}
      <AnimatePresence>
        {showMatchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowMatchModal(null)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-brand-card border border-purple-500/30 rounded-3xl p-8 text-center max-w-xs w-full shadow-2xl glow-purple"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti-like decoration */}
              <div className="text-5xl mb-4">🎉</div>

              <h2 className="text-3xl font-black gradient-text mb-2">It&apos;s a Match!</h2>
              <p className="text-white/60 text-sm mb-6">
                You and {showMatchModal.name} liked each other
              </p>

              {/* Profile photos */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                  <img
                    src="https://picsum.photos/seed/alex1/200/200"
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-3xl">❤️</div>
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500 shadow-lg">
                  <img
                    src={showMatchModal.photos[0]}
                    alt={showMatchModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowMatchModal(null)}
                  className="w-full gradient-brand text-white font-bold py-3 rounded-2xl glow-purple hover:opacity-90 transition-opacity"
                >
                  Send a Message 💬
                </button>
                <button
                  onClick={() => setShowMatchModal(null)}
                  className="w-full bg-white/10 border border-white/20 text-white/80 font-medium py-3 rounded-2xl hover:bg-white/15 transition-colors"
                >
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        userName={cardStack.length > 0 ? cardStack[cardStack.length - 1].name : ''}
      />
    </div>
  );
}
