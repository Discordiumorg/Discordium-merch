'use client';

import { motion } from 'framer-motion';
import { MapPin, Heart, Star, MessageCircle } from 'lucide-react';
import { User, goalColors, goalEmojis } from '@/lib/mockData';
import SocialLinks from '@/components/SocialLinks';

interface ProfileCardProps {
  user: User;
  onClick?: () => void;
  onLike?: () => void;
  onSuperLike?: () => void;
  onMessage?: () => void;
  isMatched?: boolean;
  compact?: boolean;
  index?: number;
}

export default function ProfileCard({
  user,
  onClick,
  onLike,
  onSuperLike,
  onMessage,
  isMatched = false,
  compact = false,
  index = 0,
}: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="card-hover cursor-pointer rounded-2xl overflow-hidden"
      onClick={onClick}
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] bg-brand-surface overflow-hidden">
        <img
          src={user.photos[0]}
          alt={user.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Online badge */}
        {user.online && (
          <div className="absolute top-2.5 right-2.5">
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-green-400 text-[10px] font-semibold px-2 py-1 rounded-full border border-green-400/30">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Online
            </span>
          </div>
        )}

        {/* Verified badge */}
        {user.verified && (
          <div className="absolute top-2.5 left-2.5">
            <span className="text-blue-400 bg-black/40 backdrop-blur-sm w-6 h-6 flex items-center justify-center rounded-full text-xs border border-blue-400/30">
              ✓
            </span>
          </div>
        )}

        {/* Matched overlay */}
        {isMatched && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-600/40 to-transparent h-12 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-purple-500/60 backdrop-blur px-2 py-0.5 rounded-full">
              Matched
            </span>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-white font-bold text-base leading-tight">
                  {user.name}
                </span>
                <span className="text-white/80 text-sm">{user.age}</span>
              </div>
              {!compact && (
                <div className="flex items-center gap-1 text-white/60 text-[11px]">
                  <MapPin size={10} />
                  <span>{user.distance}km</span>
                </div>
              )}
            </div>
          </div>

          {/* Goal badge - compact version */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${goalColors[user.relationshipGoal]}`}>
              <span>{goalEmojis[user.relationshipGoal]}</span>
              <span className="hidden sm:inline">
                {user.relationshipGoal.charAt(0).toUpperCase() + user.relationshipGoal.slice(1)}
              </span>
            </span>
            {user.socialLinks && (
              <SocialLinks links={user.socialLinks} size="sm" />
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      {!compact && (
        <div className="bg-brand-card border-t border-white/5 flex items-center justify-around py-2 px-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onSuperLike?.(); }}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl hover:bg-blue-500/10 transition-colors group"
          >
            <Star size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] text-white/40">Super</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onLike?.(); }}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl hover:bg-green-500/10 transition-colors group"
          >
            <Heart size={18} className="text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] text-white/40">Like</span>
          </motion.button>

          {isMatched && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onMessage?.(); }}
              className="flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl hover:bg-purple-500/10 transition-colors group"
            >
              <MessageCircle size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] text-white/40">Chat</span>
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}
