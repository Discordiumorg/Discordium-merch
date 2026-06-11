'use client';

import { motion } from 'framer-motion';

interface AuraLogoProps {
  size?: number;
  animate?: boolean;
  showWordmark?: boolean;
  wordmarkSize?: string;
  className?: string;
}

export function AuraLogomark({ size = 48, animate = false, className = '' }: { size?: number; animate?: boolean; className?: string }) {
  const ringVariants = (delay: number) => ({
    animate: {
      scale: [1, 1.06, 1],
      opacity: [0.55, 0.85, 0.55],
      transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' as const, delay },
    },
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="lg-aura" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#f43f8e" />
        </linearGradient>
        <radialGradient id="rg-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#f43f8e" />
        </radialGradient>
        <filter id="glow-aura" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {animate ? (
        <>
          <motion.circle
            cx={32} cy={32} r={29}
            stroke="url(#lg-aura)" strokeWidth={1} strokeOpacity={0.25} fill="none"
            animate={{ scale: [1, 1.04, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={32} cy={32} r={21}
            stroke="url(#lg-aura)" strokeWidth={1.5} strokeOpacity={0.55} fill="none"
            animate={ringVariants(0.4).animate}
          />
          <motion.circle
            cx={32} cy={32} r={13}
            stroke="url(#lg-aura)" strokeWidth={2} strokeOpacity={0.9} fill="none"
            filter="url(#glow-aura)"
            animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.8 }}
          />
        </>
      ) : (
        <>
          <circle cx={32} cy={32} r={29} stroke="url(#lg-aura)" strokeWidth={1} strokeOpacity={0.25} fill="none" />
          <circle cx={32} cy={32} r={21} stroke="url(#lg-aura)" strokeWidth={1.5} strokeOpacity={0.55} fill="none" />
          <circle cx={32} cy={32} r={13} stroke="url(#lg-aura)" strokeWidth={2} strokeOpacity={0.9} fill="none" filter="url(#glow-aura)" />
        </>
      )}

      {/* Center core */}
      <circle cx={32} cy={32} r={5.5} fill="url(#rg-center)" filter="url(#glow-aura)" />
      <circle cx={32} cy={32} r={3} fill="white" fillOpacity={0.9} />
    </svg>
  );
}

export default function AuraLogo({
  size = 48,
  animate = false,
  showWordmark = true,
  wordmarkSize = 'text-2xl',
  className = '',
}: AuraLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <AuraLogomark size={size} animate={animate} />
      {showWordmark && (
        <span
          className={`font-black tracking-tight ${wordmarkSize}`}
          style={{
            fontFamily: 'Syne, Inter, sans-serif',
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          aura
        </span>
      )}
    </div>
  );
}
