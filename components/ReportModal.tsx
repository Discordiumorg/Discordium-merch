'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, CheckCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

type ReportStep = 'reason' | 'detail' | 'done';

type ReportReason = 'spam' | 'harassment' | 'fakeProfile' | 'inappropriateContent' | 'underage' | 'other';

export default function ReportModal({ isOpen, onClose, userName }: ReportModalProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<ReportStep>('reason');
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState('');

  const reasons: { key: ReportReason; label: string; emoji: string }[] = [
    { key: 'spam', label: t.report.spam, emoji: '📧' },
    { key: 'harassment', label: t.report.harassment, emoji: '🚫' },
    { key: 'fakeProfile', label: t.report.fakeProfile, emoji: '🎭' },
    { key: 'inappropriateContent', label: t.report.inappropriateContent, emoji: '⚠️' },
    { key: 'underage', label: t.report.underage, emoji: '🔞' },
    { key: 'other', label: t.report.other, emoji: '❓' },
  ];

  const handleClose = () => {
    setStep('reason');
    setSelectedReason(null);
    setDetail('');
    onClose();
  };

  const handleSubmit = () => {
    setStep('done');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-brand-card rounded-t-3xl border-t border-white/10 overflow-hidden"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-2" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-2">
              <div className="flex items-center gap-2">
                <Flag size={18} className="text-red-400" />
                <h2 className="text-white font-bold text-base">
                  {step === 'done' ? t.report.submitted : t.report.title}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-5 pb-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Select Reason */}
                {step === 'reason' && (
                  <motion.div
                    key="reason"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <p className="text-white/60 text-sm mb-4">
                      {t.report.whyReporting}
                    </p>
                    <div className="space-y-2">
                      {reasons.map((reason) => (
                        <button
                          key={reason.key}
                          onClick={() => setSelectedReason(reason.key)}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                            selectedReason === reason.key
                              ? 'bg-red-500/15 border-red-500/40 text-white'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-lg flex-shrink-0">{reason.emoji}</span>
                          <span className="text-sm font-medium">{reason.label}</span>
                          {selectedReason === reason.key && (
                            <span className="ml-auto text-red-400 text-xs font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => selectedReason && setStep('detail')}
                      disabled={!selectedReason}
                      className={`mt-5 w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
                        selectedReason
                          ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                          : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      Next
                    </button>
                    <button
                      onClick={handleClose}
                      className="mt-2 w-full py-3 rounded-2xl text-white/50 text-sm font-medium hover:text-white/80 transition-colors"
                    >
                      {t.report.cancel}
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Optional detail */}
                {step === 'detail' && (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <p className="text-white/60 text-sm mb-4">
                      Tell us more (optional)
                    </p>
                    <textarea
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      placeholder="Any additional details..."
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSubmit}
                      className="mt-4 w-full py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg transition-colors"
                    >
                      {t.report.submit}
                    </motion.button>
                    <button
                      onClick={() => setStep('reason')}
                      className="mt-2 w-full py-3 rounded-2xl text-white/50 text-sm font-medium hover:text-white/80 transition-colors"
                    >
                      {t.common.back}
                    </button>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === 'done' && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle size={40} className="text-green-400" />
                    </motion.div>
                    <h3 className="text-white font-black text-lg mb-2">{t.report.submitted}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                      {t.report.thankYou}
                    </p>
                    <button
                      onClick={handleClose}
                      className="w-full py-3.5 rounded-2xl gradient-brand text-white font-bold text-sm"
                    >
                      {t.common.done}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
