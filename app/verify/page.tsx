'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Lock, ChevronDown, ChevronUp, Sparkles, Shield, Camera, X } from 'lucide-react';
import {
  calculateVerification,
  TIER_CONFIG,
  VerificationTier,
  type ProfileFactors,
} from '@/lib/verificationAlgorithm';

// Mock profile factors — in production these come from the user's actual profile
const mockFactors: ProfileFactors = {
  hasPhoto: true,
  photoCount: 4,
  bioLength: 120,
  interestCount: 6,
  hasPhone: false,
  hasEmail: true,
  socialLinkCount: 2,
  hasRelationshipGoal: true,
  reportCount: 0,
  daysActive: 14,
  responseRate: 72,
  ageVerified: true,
  idUploaded: false,
  selfieVerified: false,
};

const TIER_ORDER: VerificationTier[] = ['unverified', 'basic', 'verified', 'aura_verified'];

function ScoreRing({ score, tier }: { score: number; tier: VerificationTier }) {
  const [displayed, setDisplayed] = useState(0);
  const r = 64;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * r;
  const filled = (displayed / 100) * circumference;
  const cfg = TIER_CONFIG[tier];

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 1.5;
        if (start >= score) { setDisplayed(score); return; }
        setDisplayed(Math.round(start));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 300);
    return () => clearTimeout(timeout);
  }, [score]);

  const strokeColor =
    tier === 'aura_verified' ? 'url(#ring-grad-aura)' :
    tier === 'verified' ? 'url(#ring-grad-verified)' :
    tier === 'basic' ? 'url(#ring-grad-basic)' :
    'rgba(255,255,255,0.15)';

  return (
    <div className="relative flex items-center justify-center">
      <svg width={160} height={160} viewBox="0 0 160 160">
        <defs>
          <linearGradient id="ring-grad-aura" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#f43f8e" />
          </linearGradient>
          <linearGradient id="ring-grad-verified" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="ring-grad-basic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <filter id="ring-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={10} />

        {/* Progress arc */}
        <motion.circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#ring-glow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />

        {/* Center badge glow */}
        {tier !== 'unverified' && (
          <circle cx={cx} cy={cy} r={48} fill={cfg.bg} />
        )}
      </svg>

      {/* Score number overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-black tabular-nums ${cfg.color}`}>{displayed}</span>
        <span className="text-white/30 text-xs font-medium">/ 100</span>
        <span className={`text-xs font-bold mt-1 ${cfg.color}`}>{cfg.label}</span>
      </div>
    </div>
  );
}

function CategoryCard({ cat, index }: { cat: ReturnType<typeof calculateVerification>['categories'][0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round((cat.score / cat.maxScore) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className="card-glass rounded-2xl border border-white/10 overflow-hidden"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3.5 flex items-center gap-3"
      >
        <span className="text-xl">{cat.icon}</span>
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white font-semibold text-sm">{cat.name}</span>
            <span className="text-white/50 text-xs font-medium">{cat.score} / {cat.maxScore}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: pct >= 80 ? 'linear-gradient(90deg,#a855f7,#f43f8e)' : pct >= 50 ? 'linear-gradient(90deg,#38bdf8,#818cf8)' : 'linear-gradient(90deg,#94a3b8,#cbd5e1)' }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="text-white/30">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2.5 border-t border-white/8 pt-3">
              {cat.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.done
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-white/8 border border-white/15'
                  }`}>
                    {item.done
                      ? <Check size={11} className="text-white" />
                      : <Lock size={10} className="text-white/30" />
                    }
                  </div>
                  <span className={`text-sm flex-1 ${item.done ? 'text-white/80' : 'text-white/35'}`}>
                    {item.label}
                  </span>
                  <span className={`text-xs font-bold ${item.done ? 'text-purple-400' : 'text-white/20'}`}>
                    +{item.points}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TierRoadmap({ currentTier }: { currentTier: VerificationTier }) {
  const tiers: { tier: VerificationTier; threshold: number }[] = [
    { tier: 'basic', threshold: 40 },
    { tier: 'verified', threshold: 65 },
    { tier: 'aura_verified', threshold: 85 },
  ];

  return (
    <div className="card-glass rounded-2xl p-4 border border-white/10">
      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">Tier Roadmap</p>
      <div className="space-y-3">
        {tiers.map(({ tier, threshold }) => {
          const cfg = TIER_CONFIG[tier];
          const passed = TIER_ORDER.indexOf(currentTier) >= TIER_ORDER.indexOf(tier);
          const isCurrent = currentTier === tier;
          return (
            <div key={tier} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold"
                style={{
                  background: passed ? cfg.bg : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${passed ? cfg.border : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isCurrent ? cfg.glow : 'none',
                }}
              >
                {passed ? '✓' : '○'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${passed ? cfg.color : 'text-white/30'}`}>
                    {cfg.label}
                  </span>
                  <span className="text-white/25 text-xs">{threshold}+ pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const router = useRouter();
  const [factors, setFactors] = useState<ProfileFactors>(mockFactors);
  const [applyStep, setApplyStep] = useState<null | 'selfie' | 'id' | 'phone' | 'done'>(null);
  const [toast, setToast] = useState('');
  const [showIdUpload, setShowIdUpload] = useState(false);
  const [idUploadStep, setIdUploadStep] = useState(1);
  const [idDocType, setIdDocType] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const result = calculateVerification(factors);
  const cfg = TIER_CONFIG[result.tier];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const handleAction = (action: string) => {
    if (action === 'phone') {
      setFactors((f) => ({ ...f, hasPhone: true }));
      showToast('📱 Phone number verified! +12 points');
      setApplyStep(null);
    } else if (action === 'selfie') {
      setFactors((f) => ({ ...f, selfieVerified: true }));
      showToast('🤳 Selfie verified! +2 points');
      setApplyStep(null);
    } else if (action === 'id') {
      // Show ID upload modal instead of instantly handling
      setShowIdUpload(true);
      setIdUploadStep(1);
      setIdDocType('');
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const simulateUpload = (onDone: () => void) => {
    setIsUploading(true);
    setUploadProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setIsUploading(false);
        onDone();
      }
      setUploadProgress(Math.min(100, Math.round(p)));
    }, 200);
  };

  const closeIdUpload = () => {
    setShowIdUpload(false);
    setIdUploadStep(1);
  };

  const quickActions = [
    { id: 'phone', label: 'Verify Phone', icon: '📱', points: 12, done: factors.hasPhone },
    { id: 'id', label: 'Upload ID', icon: '🪪', points: 4, done: factors.idUploaded },
    { id: 'selfie', label: 'Selfie Check', icon: '🤳', points: 2, done: factors.selfieVerified },
  ].filter((a) => !a.done);

  return (
    <div className="min-h-screen bg-brand-dark pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/8 px-5 pt-12 pb-4"
        style={{ background: 'rgba(7,6,15,0.9)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-white font-black text-lg leading-tight">Verification</h1>
            <p className="text-white/40 text-xs">Prove your authenticity</p>
          </div>
          <div className="ml-auto">
            <div
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                color: cfg.color.replace('text-', ''),
                boxShadow: cfg.glow,
              }}
            >
              <span className={cfg.color}>{cfg.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-5">
        {/* Score Ring Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass rounded-3xl p-5 border border-white/10 text-center"
        >
          <div className="flex justify-center mb-3">
            <ScoreRing score={result.score} tier={result.tier} />
          </div>

          {/* Next tier progress */}
          {result.pointsToNextTier !== null && result.nextTier && (
            <div className="mt-2">
              <p className="text-white/50 text-xs mb-2">
                <span className="text-white font-semibold">{result.pointsToNextTier} points</span> to {TIER_CONFIG[result.nextTier].label}
              </p>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mx-auto max-w-[180px]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#7c3aed,#f43f8e)' }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.round(
                      ((result.score - (result.nextTierThreshold! - result.pointsToNextTier - result.pointsToNextTier)) /
                        (result.pointsToNextTier * 2)) * 100
                    )}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          )}

          {result.tier === 'aura_verified' && (
            <p className="text-purple-300 text-sm font-bold mt-2">✦ Maximum verification achieved!</p>
          )}
        </motion.div>

        {/* Quick actions */}
        {quickActions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Quick Boost</p>
            <div className="flex gap-3">
              {quickActions.map((action) => (
                <motion.button
                  key={action.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAction(action.id)}
                  className="flex-1 card-glass rounded-2xl p-3 text-center border border-white/15 hover:border-purple-500/40 transition-colors"
                >
                  <span className="text-2xl block mb-1">{action.icon}</span>
                  <p className="text-white text-xs font-semibold">{action.label}</p>
                  <p className="text-purple-400 text-xs font-bold">+{action.points} pts</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tier roadmap */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <TierRoadmap currentTier={result.tier} />
        </motion.div>

        {/* Category breakdown */}
        <div>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Score Breakdown</p>
          <div className="space-y-3">
            {result.categories.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={i} />
            ))}
          </div>
        </div>

        {/* What verification unlocks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-gradient-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-purple-400" />
            <p className="text-white font-bold text-sm">Why get verified?</p>
          </div>
          <div className="space-y-2.5">
            {[
              { tier: 'basic', perks: ['✓ Badge on your profile', 'More visible in search results'] },
              { tier: 'verified', perks: ['✓ Blue verified badge', 'Priority in Discover feed', 'Unlock Who Liked You'] },
              { tier: 'aura_verified', perks: ['💜 Purple Aura badge', 'Top placement everywhere', 'Free weekly Boost', 'Direct message anyone'] },
            ].map(({ tier, perks }) => {
              const c = TIER_CONFIG[tier as VerificationTier];
              return (
                <div key={tier} className="flex gap-3">
                  <span className={`text-xs font-bold w-24 flex-shrink-0 ${c.color}`}>{c.label}</span>
                  <div className="space-y-0.5">
                    {perks.map((p, i) => (
                      <p key={i} className="text-white/50 text-xs">{p}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Apply CTA */}
        {result.tier !== 'aura_verified' && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => showToast('✦ Verification request submitted! We\'ll review within 24h.')}
            className="w-full gradient-brand text-white font-bold py-4 rounded-2xl glow-button flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            Apply for {result.nextTier ? TIER_CONFIG[result.nextTier].label : 'Verification'}
          </motion.button>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand-card text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-white/15 pointer-events-none whitespace-nowrap"
            style={{ boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ID Upload Modal */}
      <AnimatePresence>
        {showIdUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center"
            onClick={closeIdUpload}
          >
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-brand-card rounded-t-3xl p-6 border-t border-white/10 min-h-[60vh]"
            >
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {[1,2,3,4].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s === idUploadStep ? 'w-6 bg-purple-500' : s < idUploadStep ? 'w-3 bg-green-500' : 'w-3 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={closeIdUpload}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <X size={16} />
              </button>

              {/* Step 1: Document type */}
              {idUploadStep === 1 && (
                <div>
                  <h3 className="text-white font-black text-xl mb-1">Document type</h3>
                  <p className="text-white/50 text-sm mb-5">Select the type of document you&apos;d like to use</p>
                  <div className="space-y-3">
                    {['Passport', 'ID Card', "Driver's License"].map((type) => (
                      <button
                        key={type}
                        onClick={() => { setIdDocType(type); setIdUploadStep(2); }}
                        className={`w-full py-4 rounded-2xl font-bold text-sm border transition-all text-left px-5 flex items-center justify-between ${
                          idDocType === type
                            ? 'gradient-brand text-white border-transparent'
                            : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{type === 'Passport' ? '🛂' : type === 'ID Card' ? '🪪' : '🚗'} {type}</span>
                        <ChevronDown size={16} className="opacity-50 -rotate-90" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Front of document */}
              {idUploadStep === 2 && (
                <div>
                  <h3 className="text-white font-black text-xl mb-1">Front of document</h3>
                  <p className="text-white/50 text-sm mb-5">Make sure all details are clearly visible</p>
                  <div className="border-2 border-dashed border-white/20 rounded-2xl h-44 flex flex-col items-center justify-center gap-3 mb-5 bg-white/5">
                    <Camera size={36} className="text-white/30" />
                    <p className="text-white/40 text-sm">Position your {idDocType} here</p>
                  </div>
                  {isUploading ? (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #7c3aed, #ec4899)' }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => simulateUpload(() => setIdUploadStep(3))}
                        className="flex-1 py-3.5 rounded-2xl gradient-brand text-white font-bold text-sm"
                      >
                        📷 Take Photo
                      </button>
                      <button
                        onClick={() => simulateUpload(() => setIdUploadStep(3))}
                        className="flex-1 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-sm"
                      >
                        🖼️ Upload from Gallery
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Selfie */}
              {idUploadStep === 3 && (
                <div>
                  <h3 className="text-white font-black text-xl mb-1">Take a selfie</h3>
                  <p className="text-white/50 text-sm mb-5">Hold your face within the guide</p>
                  <div className="border-2 border-dashed border-white/20 rounded-2xl h-44 flex flex-col items-center justify-center gap-3 mb-5 bg-white/5 relative overflow-hidden">
                    {/* Face outline guide */}
                    <div className="w-28 h-32 rounded-full border-4 border-purple-500/50 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  </div>
                  {isUploading ? (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>Processing...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #7c3aed, #ec4899)' }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => simulateUpload(() => setIdUploadStep(4))}
                        className="flex-1 py-3.5 rounded-2xl gradient-brand text-white font-bold text-sm"
                      >
                        🤳 Take Selfie
                      </button>
                      <button
                        onClick={() => simulateUpload(() => setIdUploadStep(4))}
                        className="flex-1 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-sm"
                      >
                        🖼️ Upload from Gallery
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Under Review */}
              {idUploadStep === 4 && (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-5"
                  >
                    <Check size={36} className="text-green-400" />
                  </motion.div>
                  <h3 className="text-white font-black text-xl mb-2">Under Review</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    We&apos;ll verify your {idDocType} within 24 hours. You&apos;ll receive a notification once it&apos;s been reviewed.
                  </p>
                  <button
                    onClick={() => {
                      setFactors((f) => ({ ...f, idUploaded: true }));
                      showToast('🪪 ID uploaded for review! +4 points');
                      closeIdUpload();
                    }}
                    className="w-full py-3.5 rounded-2xl gradient-brand text-white font-bold"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
