'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, Gift, Video, Search, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import {
  liveStreams,
  categoryMeta,
  formatViewerCount,
  type LiveCategory,
  type LiveStream,
} from '@/lib/liveData';
import { mockMatches, mockVisitors } from '@/lib/mockData';

type FilterCategory = 'all' | LiveCategory;

const categoryFilters: { id: FilterCategory; emoji: string; label: string }[] = [
  { id: 'all',     emoji: '✨', label: 'All' },
  { id: 'dating',  emoji: '💕', label: 'Dating' },
  { id: 'chat',    emoji: '💬', label: 'Chat' },
  { id: 'music',   emoji: '🎵', label: 'Music' },
  { id: 'dance',   emoji: '💃', label: 'Dance' },
  { id: 'cooking', emoji: '🍳', label: 'Cooking' },
  { id: 'gaming',  emoji: '🎮', label: 'Gaming' },
  { id: 'travel',  emoji: '✈️', label: 'Travel' },
  { id: 'advice',  emoji: '💡', label: 'Advice' },
];

const liveCategories: { id: string; emoji: string; label: string }[] = [
  { id: 'dating',  emoji: '💕', label: 'Dating' },
  { id: 'chat',    emoji: '💬', label: 'Chat' },
  { id: 'music',   emoji: '🎵', label: 'Music' },
  { id: 'dance',   emoji: '💃', label: 'Dance' },
  { id: 'cooking', emoji: '🍳', label: 'Cooking' },
  { id: 'gaming',  emoji: '🎮', label: 'Gaming' },
  { id: 'travel',  emoji: '✈️', label: 'Travel' },
  { id: 'advice',  emoji: '💡', label: 'Advice' },
];

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="w-1.5 h-1.5 rounded-full bg-white inline-block"
      />
      LIVE
    </span>
  );
}

function StreamCard({ stream, onClick }: { stream: LiveStream; onClick: () => void }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-b ${stream.color}`}
      style={{ aspectRatio: '3/4' }}
    >
      {/* Host photo */}
      <img
        src={stream.hostPhoto}
        alt={stream.hostName}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top row */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
        <LiveBadge />
        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
          <Eye size={10} />
          {formatViewerCount(stream.viewerCount)}
        </div>
      </div>

      {/* Hot/New badge */}
      {stream.badge && stream.badge !== 'featured' && (
        <div className="absolute top-8 left-2">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
            stream.badge === 'hot'
              ? 'bg-orange-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {stream.badge === 'hot' ? '🔥 HOT' : '✨ NEW'}
          </span>
        </div>
      )}

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-white font-bold text-sm">{stream.hostName}, {stream.hostAge}</span>
          {stream.hostVerified && (
            <span className="text-blue-400 text-xs">✓</span>
          )}
        </div>
        <p className="text-white/80 text-[11px] truncate">{stream.title}</p>
        <span className="text-white/50 text-[10px]">
          {categoryMeta[stream.category].emoji} {categoryMeta[stream.category].label}
        </span>
      </div>
    </motion.div>
  );
}

function GoLiveModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('dating');
  const [isLive, setIsLive] = useState(false);

  const handleStart = () => {
    if (title.trim()) {
      setIsLive(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-brand-card rounded-t-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="px-5 pb-8 pt-2">
          {!isLive ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">Go Live 🔴</h2>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60">
                  <X size={16} />
                </button>
              </div>

              {/* Camera preview */}
              <motion.div
                animate={{
                  background: [
                    'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                    'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                    'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-full h-44 rounded-2xl mb-4 flex items-center justify-center"
              >
                <div className="text-center">
                  <Video size={40} className="text-white/60 mx-auto mb-2" />
                  <p className="text-white/50 text-sm">Camera Preview</p>
                </div>
              </motion.div>

              {/* Title input */}
              <div className="mb-4">
                <label className="text-white/60 text-xs font-medium mb-1.5 block">Stream Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your stream about?"
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Category selector */}
              <div className="mb-5">
                <label className="text-white/60 text-xs font-medium mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {liveCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                        selectedCategory === cat.id
                          ? 'gradient-brand text-white border-transparent'
                          : 'bg-white/5 border-white/15 text-white/60'
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={!title.trim()}
                className="w-full gradient-brand text-white font-bold py-4 rounded-2xl disabled:opacity-40 transition-opacity"
              >
                Start Streaming 🔴
              </button>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-3xl">🔴</span>
              </motion.div>
              <h3 className="text-white font-black text-2xl mb-2">You&apos;re Live!</h3>
              <p className="text-white/60 text-sm mb-2">&ldquo;{title}&rdquo;</p>
              <p className="text-white/40 text-xs mb-6">Your stream is now visible to everyone nearby</p>
              <button
                onClick={onClose}
                className="w-full bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-2xl"
              >
                End Stream
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LivePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [showGoLive, setShowGoLive] = useState(false);

  const unreadMatches = mockMatches.filter((m) => m.unreadCount > 0).length;
  const newVisitors = mockVisitors.filter((v) => Date.now() - v.visitedAt.getTime() < 86400000).length;

  const featuredStream = liveStreams.find((s) => s.badge === 'featured');
  const filteredStreams = liveStreams.filter((s) => {
    if (s.badge === 'featured') return false;
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-2.5 h-2.5 rounded-full bg-red-500"
            />
            <h1 className="text-white font-black text-xl">Live</h1>
            <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
              {liveStreams.length} live now
            </span>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60">
            <Search size={16} />
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat.id
                  ? 'gradient-brand text-white border-transparent'
                  : 'bg-white/5 border-white/15 text-white/50 hover:text-white/80'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-28">
        {/* Featured Live */}
        {featuredStream && (activeCategory === 'all' || activeCategory === featuredStream.category) && (
          <div className="mb-5">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
              ⭐ Featured Live
            </p>
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/live/${featuredStream.id}`)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${featuredStream.color}`}
              style={{ height: '200px' }}
            >
              {/* Host photo */}
              <img
                src={featuredStream.hostPhoto}
                alt={featuredStream.hostName}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Animated pulsing overlay */}
              <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`absolute inset-0 bg-gradient-to-br ${featuredStream.color} mix-blend-overlay`}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={featuredStream.hostPhoto}
                        alt={featuredStream.hostName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-[-3px] rounded-full border-2 border-red-500"
                      />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{featuredStream.hostName}, {featuredStream.hostAge}</p>
                      <LiveBadge />
                    </div>
                  </div>
                  <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                    ⭐ FEATURED
                  </span>
                </div>

                <div>
                  <p className="text-white font-bold text-base mb-2">{featuredStream.title}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-white/80 text-xs">
                        <Eye size={12} />
                        {formatViewerCount(featuredStream.viewerCount)}
                      </span>
                      <span className="flex items-center gap-1 text-white/80 text-xs">
                        <Gift size={12} />
                        {formatViewerCount(featuredStream.gifts)}
                      </span>
                    </div>
                    <button className="gradient-brand text-white text-xs font-bold px-4 py-2 rounded-full">
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Stream Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredStreams.map((stream) => (
            <StreamCard
              key={stream.id}
              stream={stream}
              onClick={() => router.push(`/live/${stream.id}`)}
            />
          ))}
        </div>

        {filteredStreams.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📡</p>
            <p className="text-white/50 font-medium">No live streams in this category</p>
          </div>
        )}
      </div>

      {/* Go Live FAB */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setShowGoLive(true)}
        className="fixed bottom-24 right-5 z-40 gradient-brand text-white font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-xl"
        style={{ boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}
      >
        <Video size={18} />
        <span className="text-sm">Go Live</span>
      </motion.button>

      <BottomNav matchCount={unreadMatches} visitorCount={newVisitors} />

      {/* Go Live Modal */}
      <AnimatePresence>
        {showGoLive && (
          <GoLiveModal onClose={() => setShowGoLive(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
