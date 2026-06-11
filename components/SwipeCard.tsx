'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Briefcase, Heart, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { User, goalColors, goalEmojis } from '@/lib/mockData';
import SocialLinks from '@/components/SocialLinks';

interface SwipeCardProps {
  user: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike: () => void;
  isTop: boolean;
  zIndex: number;
  compatibilityScore?: number;
}

export default function SwipeCard({
  user,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  isTop,
  zIndex,
  compatibilityScore,
}: SwipeCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120) {
      onSwipeRight();
    } else if (info.offset.x < -120) {
      onSwipeLeft();
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex < user.photos.length - 1) setPhotoIndex(photoIndex + 1);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex > 0) setPhotoIndex(photoIndex - 1);
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
      style={{ x, rotate, opacity, zIndex }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${user.photos[photoIndex]})` }}
        />

        {/* Photo navigation */}
        {isTop && user.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white z-10 disabled:opacity-30"
              disabled={photoIndex === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white z-10 disabled:opacity-30"
              disabled={photoIndex === user.photos.length - 1}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Compatibility Score Badge */}
        {compatibilityScore !== undefined && (
          <div className={`absolute top-3 right-3 z-20 px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg ${
            compatibilityScore >= 80
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
              : compatibilityScore >= 60
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
              : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
          }`}>
            {compatibilityScore >= 80
              ? `${compatibilityScore}% Match ✦`
              : `${compatibilityScore}% Match`}
          </div>
        )}

        {/* Photo dots */}
        {user.photos.length > 1 && (
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {user.photos.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === photoIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Like / Nope overlays */}
        <motion.div
          className="absolute top-10 left-8 rotate-[-15deg] border-4 border-green-400 rounded-lg px-4 py-2 z-20"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-green-400 font-black text-3xl tracking-widest">LIKE</span>
        </motion.div>
        <motion.div
          className="absolute top-10 right-8 rotate-[15deg] border-4 border-red-400 rounded-lg px-4 py-2 z-20"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-red-400 font-black text-3xl tracking-widest">NOPE</span>
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-card" />

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white text-3xl font-bold">{user.name}</h2>
                <span className="text-white/90 text-2xl font-light">{user.age}</span>
                {user.verified && (
                  <span className="text-blue-400 text-lg">✓</span>
                )}
                {user.online && (
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                )}
              </div>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {user.distance} km away
                </span>
                {user.job && (
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} />
                    {user.job}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Goal badge */}
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${goalColors[user.relationshipGoal]}`}>
              <span>{goalEmojis[user.relationshipGoal]}</span>
              {user.relationshipGoal.charAt(0).toUpperCase() + user.relationshipGoal.slice(1)}
            </span>
          </div>

          {/* Bio - expandable */}
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-left"
          >
            <p className={`text-white/85 text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
              {user.bio}
            </p>
            {!expanded && user.bio.length > 80 && (
              <span className="text-white/60 text-xs">tap to read more</span>
            )}
          </button>

          {/* Interests */}
          {expanded && (
            <div className="flex flex-wrap gap-2 mt-3">
              {user.interests.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="bg-white/15 backdrop-blur-sm text-white/90 text-xs px-3 py-1 rounded-full border border-white/20"
                >
                  {interest}
                </span>
              ))}
              {user.socialLinks && (
                <div className="w-full mt-2">
                  <SocialLinks links={user.socialLinks} size="sm" />
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {isTop && (
            <div className="flex items-center justify-center gap-5 mt-5">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onSwipeLeft(); }}
                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors shadow-lg"
              >
                <X size={26} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onSuperLike(); }}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                <Star size={20} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onSwipeRight(); }}
                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-colors shadow-lg"
              >
                <Heart size={26} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
