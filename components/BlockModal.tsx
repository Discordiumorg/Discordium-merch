'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { UserX, Flag, MessageCircleOff, X } from 'lucide-react';

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onUnmatch?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
}

export default function BlockModal({
  isOpen,
  onClose,
  userName,
  onUnmatch,
  onBlock,
  onReport,
}: BlockModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto"
          >
            <div className="bg-brand-card border border-white/10 rounded-t-3xl px-5 pt-5 pb-10">
              {/* Handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

              <p className="text-white/50 text-xs text-center mb-4 uppercase tracking-widest font-semibold">
                {userName}
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => { onUnmatch?.(); onClose(); }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircleOff size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Unmatch</p>
                    <p className="text-white/40 text-xs">Remove from your matches</p>
                  </div>
                </button>

                <button
                  onClick={() => { onBlock?.(); onClose(); }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-red-500/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <UserX size={18} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold text-sm">Block</p>
                    <p className="text-white/40 text-xs">Block and remove from all lists</p>
                  </div>
                </button>

                <button
                  onClick={() => { onReport?.(); onClose(); }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-red-500/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Flag size={18} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold text-sm">Report</p>
                    <p className="text-white/40 text-xs">Report inappropriate behavior</p>
                  </div>
                </button>

                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors mt-2"
                >
                  <X size={16} className="text-white/60" />
                  <span className="text-white/60 font-semibold text-sm">Cancel</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
