'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserX, RotateCcw, AlertTriangle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useI18n } from '@/lib/i18n';

interface BlockedUser {
  id: string;
  name: string;
  age: number;
  emoji: string;
  blockedAt: string;
  reason: string;
}

const BLOCKED_USERS: BlockedUser[] = [
  { id: '1', name: 'Marco P.', age: 31, emoji: '😶', blockedAt: 'Vor 3 Tagen', reason: 'Unangemessene Nachrichten' },
  { id: '2', name: 'Jana K.', age: 27, emoji: '😶', blockedAt: 'Vor 1 Woche', reason: 'Belästigung' },
  { id: '3', name: 'Tim W.', age: 29, emoji: '😶', blockedAt: 'Vor 2 Wochen', reason: 'Fake-Profil' },
];

export default function BlockedPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [blocked, setBlocked] = useState<BlockedUser[]>(BLOCKED_USERS);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [justUnblocked, setJustUnblocked] = useState<string | null>(null);

  const unblock = (id: string) => {
    const user = blocked.find(u => u.id === id);
    setBlocked(prev => prev.filter(u => u.id !== id));
    setShowConfirm(null);
    setJustUnblocked(user?.name || null);
    setTimeout(() => setJustUnblocked(null), 2500);
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <div className="flex items-center gap-2">
            <UserX size={18} className="text-red-400" />
            <h1 className="text-white font-black text-xl">{t.blocked.title}</h1>
          </div>
          {blocked.length > 0 && (
            <span className="ml-auto bg-red-500/20 text-red-300 text-xs font-bold px-2.5 py-1 rounded-full border border-red-500/25">{blocked.length}</span>
          )}
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div className="card-glass rounded-2xl p-3.5 border border-yellow-500/20 flex items-start gap-3">
          <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-300/80 text-xs leading-relaxed">{t.blocked.info}</p>
        </div>

        <AnimatePresence>
          {blocked.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -80, scale: 0.9 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 280, damping: 24 }}
              className="card-glass rounded-2xl p-4 border border-white/8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0 filter grayscale">{user.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 font-bold text-sm">{user.name}, {user.age}</p>
                  <p className="text-white/35 text-xs">{user.reason}</p>
                  <p className="text-white/25 text-[10px] mt-0.5">Blockiert {user.blockedAt}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowConfirm(user.id)}
                  className="flex items-center gap-1.5 bg-white/8 border border-white/10 text-white/50 text-xs font-semibold px-3 py-2 rounded-xl hover:border-purple-500/30 hover:text-white/70 transition-all"
                >
                  <RotateCcw size={12} /> {t.blocked.unblock}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {blocked.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <p className="text-5xl mb-4">✅</p>
            <p className="text-white/50 text-base font-semibold">{t.blocked.empty}</p>
            <p className="text-white/30 text-sm mt-1">{t.blocked.emptyDesc}</p>
          </motion.div>
        )}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', stiffness: 340, damping: 28 }} className="bg-brand-card rounded-3xl p-6 w-full max-w-md">
              <p className="text-white font-black text-center text-lg mb-2">{t.blocked.confirmTitle}</p>
              <p className="text-white/50 text-sm text-center mb-5">{t.blocked.confirmDesc(blocked.find(u => u.id === showConfirm)?.name ?? '')}</p>
              <button onClick={() => unblock(showConfirm)} className="w-full gradient-brand text-white font-bold py-3 rounded-2xl glow-button mb-2">{t.blocked.doUnblock}</button>
              <button onClick={() => setShowConfirm(null)} className="w-full bg-white/10 text-white/70 py-3 rounded-2xl">{t.blocked.cancel}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {justUnblocked && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-green-500 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-2xl z-50">
            {t.blocked.unblockedToast(justUnblocked ?? '')}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
