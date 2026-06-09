'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Crown,
  Zap,
  ArrowLeft,
  Sparkles,
  Shield,
  Eye,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { plans, type PlanId } from '@/lib/shopData';
import BottomNav from '@/components/BottomNav';

const perks = [
  { icon: Heart, label: 'Unlimited Likes', desc: 'Like as many profiles as you want' },
  { icon: Eye, label: 'See Who Liked You', desc: 'No more guessing — see your admirers' },
  { icon: Zap, label: 'Profile Boosts', desc: 'Appear at the top for 30 minutes' },
  { icon: MessageCircle, label: 'Read Receipts', desc: 'Know when your messages are read' },
  { icon: Shield, label: 'Incognito Mode', desc: 'Browse privately — only in Platinum' },
  { icon: Sparkles, label: 'Priority Matching', desc: 'Get matched with top profiles first' },
];

export default function PremiumPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [selected, setSelected] = useState<PlanId>('premium');
  const [purchased, setPurchased] = useState(false);

  const selectedPlan = plans.find((p) => p.id === selected)!;
  const price = billing === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;

  const handleSubscribe = () => {
    if (selected === 'free') return;
    setPurchased(true);
    setTimeout(() => {
      router.push('/profile');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-dark overflow-x-hidden pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex items-center gap-2">
          <Crown size={20} className="text-yellow-400" />
          <h1 className="text-white font-black text-xl">Go Premium</h1>
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
            className="text-6xl mb-4"
          >
            👑
          </motion.div>
          <h2 className="text-white font-black text-2xl mb-2">
            Unlock Your Full Potential
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
            Get more matches, more visibility, and more connections with Premium features.
          </p>
        </motion.div>

        {/* Perks strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex-shrink-0 card-glass rounded-2xl p-4 w-32 text-center"
            >
              <perk.icon size={22} className="text-purple-400 mx-auto mb-2" />
              <p className="text-white text-xs font-semibold leading-tight">{perk.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              billing === 'monthly'
                ? 'gradient-brand text-white shadow-lg'
                : 'text-white/50 card-glass'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
              billing === 'yearly'
                ? 'gradient-brand text-white shadow-lg'
                : 'text-white/50 card-glass'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              -40%
            </span>
          </button>
        </div>

        {/* Plans */}
        <div className="space-y-4 mb-8">
          {plans.map((plan, i) => {
            const isSelected = selected === plan.id;
            const displayPrice = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(plan.id)}
                className={`w-full text-left rounded-2xl overflow-hidden border-2 transition-all ${
                  isSelected ? 'border-purple-500' : 'border-white/10'
                }`}
              >
                {/* Plan header */}
                <div className={`bg-gradient-to-r ${plan.gradient} p-4 relative`}>
                  {plan.badge && (
                    <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {plan.emoji}
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">{plan.name}</p>
                      <p className="text-white/80 text-sm">
                        {plan.id === 'free' ? (
                          'Always free'
                        ) : (
                          <>
                            <span className="font-bold">€{displayPrice.toFixed(2)}</span>
                            <span className="text-white/60"> / month</span>
                            {billing === 'yearly' && (
                              <span className="text-white/60 text-xs ml-1">
                                (billed yearly)
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-white border-white'
                            : 'border-white/40'
                        }`}
                      >
                        {isSelected && <Check size={14} className="text-purple-600" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-brand-card p-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  {plan.features.slice(0, 8).map((feat) => (
                    <div key={feat.label} className="flex items-center gap-2">
                      {feat.included ? (
                        <Check
                          size={13}
                          className={feat.highlight ? 'text-purple-400 flex-shrink-0' : 'text-green-400 flex-shrink-0'}
                          strokeWidth={2.5}
                        />
                      ) : (
                        <X size={13} className="text-white/20 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          feat.included
                            ? feat.highlight
                              ? 'text-purple-300 font-semibold'
                              : 'text-white/80'
                            : 'text-white/25 line-through'
                        }`}
                      >
                        {feat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-white/30 text-xs mb-4">
            Cancel anytime · Secure payment · No hidden fees
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubscribe}
            disabled={selected === 'free'}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-2xl transition-all ${
              selected === 'free'
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'gradient-brand text-white hover:opacity-90'
            }`}
          >
            {selected === 'free'
              ? 'Current Plan'
              : `Subscribe to ${selectedPlan.name} ${selectedPlan.emoji}`}
          </motion.button>
          {selected !== 'free' && (
            <p className="text-white/30 text-xs mt-3">
              €{price.toFixed(2)}/month
              {billing === 'yearly' ? ', billed as €' + (price * 12).toFixed(2) + '/year' : ''}
            </p>
          )}
        </motion.div>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {purchased && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center px-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: 2, duration: 0.4 }}
                className="text-7xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-white font-black text-3xl mb-2">Welcome to {selectedPlan.name}!</h2>
              <p className="text-white/60 text-base">Your premium features are now active</p>
              <div className="mt-6 flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-2xl"
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
