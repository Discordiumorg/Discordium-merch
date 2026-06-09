'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Send, Share2 } from 'lucide-react';
import { Story, formatRelativeTime } from '@/lib/mockData';

interface StoryViewerProps {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}

const STORY_DURATION = 5000; // 5 seconds

export default function StoryViewer({ stories, startIndex, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(
    new Set(stories.filter((s) => s.liked).map((s) => s.id))
  );
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [paused, setPaused] = useState(false);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(Date.now());
  const elapsed = useRef(0);

  const current = stories[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
      elapsed.current = 0;
      startTime.current = Date.now();
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
      elapsed.current = 0;
      startTime.current = Date.now();
    }
  }, [currentIndex]);

  // Progress timer
  useEffect(() => {
    if (paused || showReply) return;

    startTime.current = Date.now();

    progressInterval.current = setInterval(() => {
      const now = Date.now();
      const totalElapsed = elapsed.current + (now - startTime.current);
      const pct = (totalElapsed / STORY_DURATION) * 100;

      if (pct >= 100) {
        clearInterval(progressInterval.current!);
        goNext();
      } else {
        setProgress(pct);
      }
    }, 50);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      elapsed.current += Date.now() - startTime.current;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, paused, showReply]);

  // Reset elapsed on story change
  useEffect(() => {
    elapsed.current = 0;
    setProgress(0);
  }, [currentIndex]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showReply) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      goPrev();
    } else {
      goNext();
    }
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(current.id)) next.delete(current.id);
      else next.add(current.id);
      return next;
    });
  };

  const sendReply = () => {
    if (replyText.trim()) {
      setReplyText('');
      setShowReply(false);
    }
  };

  const isLiked = liked.has(current.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black max-w-md mx-auto"
      style={{ maxWidth: '448px', left: '50%', transform: 'translateX(-50%)' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {current.mediaType === 'gradient' ? (
          <div className={`w-full h-full bg-gradient-to-br ${current.gradient}`} />
        ) : (
          <>
            <img
              src={current.user.photos[0]}
              alt={current.user.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}
      </div>

      {/* Tap zones */}
      <div
        className="absolute inset-0 z-10"
        onClick={handleTap}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      />

      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-3 pt-3">
        {stories.map((s, i) => (
          <div key={s.id} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              style={{
                width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
              }}
              transition={{ duration: 0.05 }}
            />
          </div>
        ))}
      </div>

      {/* Header: avatar + name + time */}
      <div className="absolute top-8 left-0 right-0 z-20 flex items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/70 flex-shrink-0">
            <img
              src={current.user.photos[0]}
              alt={current.user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{current.user.name}</p>
            <p className="text-white/70 text-[10px]">{formatRelativeTime(current.createdAt)}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white z-30"
        >
          <X size={20} />
        </button>
      </div>

      {/* Caption */}
      {(current.caption || current.emoji) && (
        <div className="absolute bottom-32 left-0 right-0 z-20 px-6 text-center pointer-events-none">
          <p className="text-white text-lg font-semibold drop-shadow-lg">
            {current.caption} {current.emoji}
          </p>
        </div>
      )}

      {/* Bottom actions */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-8">
        <AnimatePresence>
          {showReply ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                placeholder={`Reply to ${current.user.name}...`}
                className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 text-sm focus:outline-none"
                autoFocus
              />
              <button
                onClick={sendReply}
                className="w-10 h-10 gradient-brand rounded-full flex items-center justify-center flex-shrink-0"
              >
                <Send size={16} className="text-white" />
              </button>
              <button
                onClick={() => setShowReply(false)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <X size={16} className="text-white" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Views count */}
              <p className="text-white/60 text-xs">{current.views} views</p>

              <div className="flex items-center gap-3">
                {/* Like */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={toggleLike}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <Heart
                    size={24}
                    className={isLiked ? 'text-pink-500' : 'text-white'}
                    fill={isLiked ? 'currentColor' : 'none'}
                  />
                </motion.button>

                {/* Reply */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowReply(true)}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <Send size={22} className="text-white" />
                </motion.button>

                {/* Share */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <Share2 size={22} className="text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
