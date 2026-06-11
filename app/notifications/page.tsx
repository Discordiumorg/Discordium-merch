'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockNotifications, AppNotification, NotifType } from '@/lib/notificationsData';
import BottomNav from '@/components/BottomNav';

const TYPE_ICON: Record<NotifType, string> = {
  like: '❤️',
  superlike: '⭐',
  match: '🎉',
  message: '💬',
  visitor: '👀',
  boost_expiry: '⚡',
  rose: '🌹',
  gift: '🎁',
  story_view: '📖',
  promo: '🛍️',
};

const FILTER_TABS: { key: 'all' | NotifType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'match', label: 'Matches' },
  { key: 'like', label: 'Likes' },
  { key: 'message', label: 'Messages' },
  { key: 'visitor', label: 'Visitors' },
];

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<'all' | NotifType>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter(
    (n) => activeFilter === 'all' || n.type === activeFilter ||
      (activeFilter === 'like' && (n.type === 'like' || n.type === 'superlike'))
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleTap = (notif: AppNotification) => {
    markRead(notif.id);
    if (notif.actionPath) router.push(notif.actionPath);
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <Bell size={20} className="text-purple-400" />
            <h1 className="text-white font-black text-xl">Notifications</h1>
            {unreadCount > 0 && (
              <span className="gradient-brand text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold"
            >
              <Check size={14} />
              All read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === tab.key
                  ? 'gradient-brand text-white'
                  : 'card-glass text-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-8">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-white font-bold text-lg mb-2">All quiet here</h3>
            <p className="text-white/40 text-sm">New activity will show up here</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((notif, i) => (
              <motion.button
                key={notif.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleTap(notif)}
                className={`w-full flex items-start gap-4 px-5 py-4 text-left transition-colors ${
                  notif.read ? 'hover:bg-white/5' : 'bg-purple-500/5 hover:bg-purple-500/10'
                }`}
              >
                {/* Icon / Avatar */}
                <div className="relative flex-shrink-0">
                  {notif.photoSeed ? (
                    <img
                      src={`https://picsum.photos/seed/${notif.photoSeed}/80/80`}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl card-glass flex items-center justify-center text-2xl">
                      {TYPE_ICON[notif.type]}
                    </div>
                  )}
                  {notif.photoSeed && (
                    <span className="absolute -bottom-1 -right-1 text-base leading-none">
                      {TYPE_ICON[notif.type]}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${notif.read ? 'text-white/70' : 'text-white font-semibold'}`}>
                    {notif.title}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5 line-clamp-2">{notif.body}</p>
                  <p className="text-white/25 text-[10px] mt-1.5">{timeAgo(notif.timestamp)}</p>
                </div>

                {/* Unread dot */}
                {!notif.read && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1.5" />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
