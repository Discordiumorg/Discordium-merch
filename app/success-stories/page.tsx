'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Plus, X, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

interface Story {
  id: string;
  names: [string, string];
  seeds: [string, string];
  city: string;
  matchedDate: string;
  quote: string;
  duration: string;
  milestone: string;
  emoji: string;
}

const STORIES: Story[] = [
  {
    id: 's1',
    names: ['Lena', 'Markus'],
    seeds: ['lena_s', 'markus_s'],
    city: 'Berlin',
    matchedDate: 'March 2024',
    quote: "We matched on a rainy Tuesday. He sent the worst icebreaker I've ever heard — and somehow that made me laugh so hard I had to meet him.",
    duration: '14 months together',
    milestone: 'Now engaged 💍',
    emoji: '💍',
  },
  {
    id: 's2',
    names: ['Sophie', 'Tim'],
    seeds: ['sophie_st', 'tim_st'],
    city: 'Munich',
    matchedDate: 'August 2023',
    quote: "I almost deleted the app the day we matched. I'm so glad I didn't. He surprised me with concert tickets on our third date.",
    duration: '22 months together',
    milestone: 'Moving in together 🏠',
    emoji: '🏠',
  },
  {
    id: 's3',
    names: ['Anna', 'Felix'],
    seeds: ['anna_af', 'felix_af'],
    city: 'Hamburg',
    matchedDate: 'January 2025',
    quote: 'Our compatibility score said 92%. We thought that was just an algorithm — turns out it was right.',
    duration: '5 months together',
    milestone: 'First vacation together ✈️',
    emoji: '✈️',
  },
  {
    id: 's4',
    names: ['Mia', 'Leon'],
    seeds: ['mia_ml', 'leon_ml'],
    city: 'Cologne',
    matchedDate: 'November 2023',
    quote: 'He sent me a Crystal Rose as his first message. I thought it was over the top — now I think it was romantic.',
    duration: '19 months together',
    milestone: 'Got a dog together 🐶',
    emoji: '🐶',
  },
  {
    id: 's5',
    names: ['Julia', 'Kai'],
    seeds: ['julia_jk', 'kai_jk'],
    city: 'Frankfurt',
    matchedDate: 'June 2024',
    quote: 'We video-dated three times before meeting in person. Those 2 minutes per round felt like hours with him.',
    duration: '12 months together',
    milestone: 'Celebrating one year 🎉',
    emoji: '🎉',
  },
];

const STATS = [
  { label: 'Matches Made', value: '2.4M+', emoji: '💞' },
  { label: 'Couples Formed', value: '180K+', emoji: '👫' },
  { label: 'Engagements', value: '12K+', emoji: '💍' },
];

export default function SuccessStoriesPage() {
  const router = useRouter();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-9 h-9 card-glass rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Heart size={20} className="text-pink-400" fill="currentColor" />
          <h1 className="text-white font-black text-xl">Success Stories</h1>
        </div>
        <button
          onClick={() => setShowShare(true)}
          className="flex items-center gap-1.5 gradient-brand text-white text-xs font-bold px-3 py-2 rounded-xl"
        >
          <Plus size={14} />
          Share Yours
        </button>
      </div>

      <div className="px-5 pb-4 pt-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="card-glass rounded-2xl p-3 text-center">
              <p className="text-2xl mb-1">{stat.emoji}</p>
              <p className="text-white font-black text-lg leading-none">{stat.value}</p>
              <p className="text-white/40 text-[10px] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="gradient-brand rounded-3xl p-5 mb-8">
          <p className="text-white font-bold text-lg leading-snug mb-2">
            "Love isn't found. It's felt."
          </p>
          <p className="text-white/70 text-xs">— The Aura Team</p>
        </div>

        {/* Stories list */}
        <div className="space-y-5">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-glass rounded-3xl overflow-hidden"
            >
              {/* Photos row */}
              <div className="relative h-44">
                <img
                  src={`https://picsum.photos/seed/${story.seeds[0]}/400/300`}
                  alt={story.names[0]}
                  className="absolute inset-0 w-1/2 h-full object-cover"
                />
                <img
                  src={`https://picsum.photos/seed/${story.seeds[1]}/400/300`}
                  alt={story.names[1]}
                  className="absolute inset-0 left-1/2 w-1/2 h-full object-cover"
                />
                {/* Heart divider */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 gradient-brand rounded-full flex items-center justify-center shadow-xl">
                  <Heart size={18} className="text-white" fill="white" />
                </div>
                {/* Gradient overlay bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-card to-transparent" />
                {/* Milestone badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {story.emoji} {story.milestone}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-black text-base">
                      {story.names[0]} & {story.names[1]}
                    </h3>
                    <p className="text-white/40 text-xs">{story.city} · Matched {story.matchedDate}</p>
                  </div>
                  <span className="text-white/40 text-xs bg-white/5 px-2.5 py-1 rounded-full">{story.duration}</span>
                </div>

                <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3 italic">
                  "{story.quote}"
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleLike(story.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      likedIds.includes(story.id)
                        ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400'
                        : 'card-glass text-white/50'
                    }`}
                  >
                    <Heart size={14} fill={likedIds.includes(story.id) ? 'currentColor' : 'none'} />
                    {likedIds.includes(story.id) ? 'Loved' : 'Love this'}
                  </button>
                  <button
                    onClick={() => setSelectedStory(story)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold card-glass text-white/50"
                  >
                    <ChevronRight size={14} />
                    Read more
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story detail overlay */}
      <AnimatePresence>
        {selectedStory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedStory(null)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-brand-card border border-white/10 rounded-t-3xl"
            >
              <div className="p-5 pb-10">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-black text-lg">{selectedStory.names[0]} & {selectedStory.names[1]}</h3>
                    <p className="text-white/40 text-xs">{selectedStory.city} · {selectedStory.duration}</p>
                  </div>
                  <span className="text-2xl">{selectedStory.emoji}</span>
                </div>
                <div className="flex gap-3 mb-4">
                  <img src={`https://picsum.photos/seed/${selectedStory.seeds[0]}/200/200`} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                  <img src={`https://picsum.photos/seed/${selectedStory.seeds[1]}/200/200`} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                </div>
                <p className="text-white/70 text-sm leading-relaxed italic mb-6">"{selectedStory.quote}"</p>
                <div className="card-gradient-border p-4 rounded-2xl mb-5">
                  <p className="text-purple-300 text-xs font-semibold mb-1">{selectedStory.milestone}</p>
                  <p className="text-white/50 text-xs">Matched {selectedStory.matchedDate} on Aura</p>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="w-full py-3.5 rounded-2xl gradient-brand text-white font-bold"
                >
                  Back to Stories
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share your story */}
      <AnimatePresence>
        {showShare && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setShowShare(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-brand-card border border-white/10 rounded-t-3xl"
            >
              <div className="p-5 pb-10">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-black text-lg">Share Your Story</h3>
                  <button onClick={() => setShowShare(false)}><X size={20} className="text-white/40" /></button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Tell us how you met and what makes your story special..."
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none mb-4 resize-none"
                />
                <input placeholder="Your partner's name" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none mb-3" />
                <button
                  onClick={() => setShowShare(false)}
                  className="w-full py-3.5 rounded-2xl gradient-brand text-white font-bold flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  Submit Story
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
