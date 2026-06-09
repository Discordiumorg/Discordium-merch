'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Flame, Video, Calendar, MessageCircle, Crown, User } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Flame, label: 'Discover' },
  { href: '/live', icon: Video, label: 'Live', live: true },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/matches', icon: MessageCircle, label: 'Matches' },
  { href: '/shop', icon: Crown, label: 'Shop', special: true },
  { href: '/profile', icon: User, label: 'Profile' },
];

interface BottomNavProps {
  matchCount?: number;
  visitorCount?: number;
}

export default function BottomNav({ matchCount = 0 }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const badges: Record<string, number> = {
    '/matches': matchCount,
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-xl border-t border-white/10" />

      <nav className="relative flex items-center justify-around px-1 py-2 pb-safe-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href
            || (item.href === '/shop' && pathname === '/premium')
            || (item.href === '/live' && pathname.startsWith('/live'));
          const badge = badges[item.href] || 0;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="relative flex flex-col items-center gap-0.5 py-2 px-2 min-w-[48px] group"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-[-6px] gradient-brand rounded-xl opacity-20"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Special glow for Shop/Crown */}
                {item.special && !isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute inset-[-4px] gradient-brand rounded-xl opacity-30 blur-sm"
                  />
                )}

                {/* Pulsing red dot for Live tab */}
                {item.live && !isActive && (
                  <motion.span
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full z-20"
                  />
                )}

                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <item.icon
                    size={20}
                    className={`transition-colors relative z-10 ${
                      isActive
                        ? 'text-purple-400'
                        : (item as { special?: boolean }).special
                        ? 'text-yellow-400 group-hover:text-yellow-300'
                        : (item as { live?: boolean }).live
                        ? 'text-red-400 group-hover:text-red-300'
                        : 'text-white/40 group-hover:text-white/70'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </motion.div>

                {badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg z-20"
                  >
                    {badge > 9 ? '9+' : badge}
                  </motion.span>
                )}
              </div>

              <span
                className={`text-[9px] font-medium transition-colors ${
                  isActive
                    ? 'text-purple-400'
                    : (item as { special?: boolean }).special
                    ? 'text-yellow-400/70 group-hover:text-yellow-400'
                    : (item as { live?: boolean }).live
                    ? 'text-red-400/70 group-hover:text-red-400'
                    : 'text-white/30 group-hover:text-white/50'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
