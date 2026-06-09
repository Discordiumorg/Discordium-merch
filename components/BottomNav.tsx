'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Flame, Grid3X3, MessageCircle, Eye, User } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Flame, label: 'Discover' },
  { href: '/browse', icon: Grid3X3, label: 'Browse' },
  { href: '/matches', icon: MessageCircle, label: 'Matches' },
  { href: '/visitors', icon: Eye, label: 'Visitors' },
  { href: '/profile', icon: User, label: 'Profile' },
];

interface BottomNavProps {
  matchCount?: number;
  visitorCount?: number;
}

export default function BottomNav({ matchCount = 0, visitorCount = 0 }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const badges: Record<string, number> = {
    '/matches': matchCount,
    '/visitors': visitorCount,
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-xl border-t border-white/10" />

      <nav className="relative flex items-center justify-around px-2 py-2 pb-safe-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const badge = badges[item.href] || 0;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="relative flex flex-col items-center gap-0.5 py-2 px-3 min-w-[60px] group"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-[-6px] gradient-brand rounded-xl opacity-20"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                    size={22}
                    className={`transition-colors ${
                      isActive
                        ? 'text-purple-400'
                        : 'text-white/40 group-hover:text-white/70'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </motion.div>

                {/* Badge */}
                {badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg"
                  >
                    {badge > 9 ? '9+' : badge}
                  </motion.span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-purple-400' : 'text-white/30 group-hover:text-white/50'
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
