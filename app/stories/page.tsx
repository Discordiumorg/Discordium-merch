'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import StoryViewer from '@/components/StoryViewer';
import { mockStories, mockMatches, mockVisitors, formatRelativeTime } from '@/lib/mockData';

export default function StoriesPage() {
  const router = useRouter();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const unreadMatches = mockMatches.filter((m) => m.unreadCount > 0).length;
  const newVisitors = mockVisitors.filter((v) => Date.now() - v.visitedAt.getTime() < 86400000).length;

  return (
    <div className="min-h-screen bg-brand-dark pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-white font-black text-xl">Stories</h1>
        </div>
      </div>

      <div className="px-4 pb-28 pt-5">
        {/* Your Story */}
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Your Story</p>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }}
          className="w-full card-glass rounded-2xl p-4 flex items-center gap-4 mb-6 border border-dashed border-white/20 hover:border-purple-500/40 transition-colors"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <Plus size={24} className="text-white" />
            </div>
          </div>
          <div className="text-left">
            <p className="text-white font-semibold">Add to Your Story</p>
            <p className="text-white/50 text-xs mt-0.5">Share a moment — visible for 24 hours</p>
          </div>
        </motion.button>

        {/* All Stories */}
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">All Stories</p>
        <div className="grid grid-cols-2 gap-3">
          {mockStories.map((story, i) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setViewerIndex(i)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              {/* Background */}
              {story.mediaType === 'gradient' ? (
                <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient}`} />
              ) : (
                <>
                  <img
                    src={story.user.photos[0]}
                    alt={story.user.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </>
              )}

              {/* Gradient ring overlay */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent"
                style={{ background: 'linear-gradient(#0f0a1a, #0f0a1a) padding-box, linear-gradient(135deg, #7c3aed, #ec4899) border-box' }}
              />

              {/* User info */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/70">
                  <img src={story.user.photos[0]} alt={story.user.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Views */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                <span className="text-white/80 text-[9px]">👁 {story.views}</span>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-bold text-xs leading-tight truncate">{story.user.name}</p>
                {story.caption && (
                  <p className="text-white/70 text-[10px] truncate mt-0.5">
                    {story.caption} {story.emoji}
                  </p>
                )}
                <p className="text-white/40 text-[9px] mt-0.5">{formatRelativeTime(story.createdAt)}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav matchCount={unreadMatches} visitorCount={newVisitors} />

      {/* Story Viewer */}
      <AnimatePresence>
        {viewerIndex !== null && (
          <StoryViewer
            stories={mockStories}
            startIndex={viewerIndex}
            onClose={() => setViewerIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
