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
      <div className="absolute inset-0 border-t border-white/8"
        style={{
          background: 'rgba(7, 6, 15, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      />
      {/* Gradient accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,132,252,0.5), transparent)' }} />

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
                    className="absolute inset-[-7px] rounded-xl"
                    style={{ background: 'rgba(147,51,234,0.18)', border: '1px solid rgba(196,132,252,0.2)' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {item.special && !isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.65, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.8 }}
                    className="absolute inset-[-5px] rounded-xl blur-sm"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(244,63,142,0.4))' }}
                  />
                )}

                {item.live && (
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.3 }}
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full z-20"
                    style={{ background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.8)' }}
                  />
                )}

                <motion.div
                  animate={{ scale: isActive ? 1.18 : 1, y: isActive ? -1 : 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                >
                  <item.icon
                    size={20}
                    className="relative z-10 transition-all"
                    style={{
                      color: isActive
                        ? '#c084fc'
                        : (item as { special?: boolean }).special
                        ? '#facc15'
                        : (item as { live?: boolean }).live
                        ? '#f87171'
                        : 'rgba(255,255,255,0.38)',
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(196,132,252,0.9))' : undefined,
                    }}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </motion.div>

                {badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center z-20"
                    style={{ background: 'linear-gradient(135deg, #ec4899, #f43f8e)', boxShadow: '0 0 8px rgba(244,63,142,0.6)' }}
                  >
                    {badge > 9 ? '9+' : badge}
                  </motion.span>
                )}
              </div>

              <span
                className="text-[9px] font-semibold transition-colors"
                style={{
                  color: isActive
                    ? '#c084fc'
                    : (item as { special?: boolean }).special
                    ? 'rgba(250,204,21,0.65)'
                    : (item as { live?: boolean }).live
                    ? 'rgba(248,113,113,0.65)'
                    : 'rgba(255,255,255,0.28)',
                }}
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
