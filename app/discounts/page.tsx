'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Tag, Clock, ChevronRight, Check, X, Gift, TrendingUp,
} from 'lucide-react';
import {
  promoCodes, campaigns, loyaltyTiers,
  type PromoCode, type Campaign,
} from '@/lib/discountsData';

// ── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(endsAt: Date) {
  const calc = () => {
    const diff = Math.max(0, endsAt.getTime() - Date.now());
    const days = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { days, h, m, s, expired: diff === 0 };
  };
  const [time, setTime] = useState(calc());
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  });
  return time;
}

function CountdownBadge({ endsAt }: { endsAt: Date }) {
  const { days, h, m, s } = useCountdown(endsAt);
  return (
    <span className="flex items-center gap-1 text-orange-400 font-mono font-bold text-xs bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">
      <Clock size={10} />
      {days > 0 ? `${days}d ` : ''}{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}

// ── Campaign card ─────────────────────────────────────────────────────────────

function CampaignCard({ c }: { c: Campaign }) {
  const router = useRouter();
  const isExpired = c.endsAt.getTime() < Date.now();

  return (
    <div className={`flex-shrink-0 w-64 card-glass rounded-2xl overflow-hidden border ${isExpired ? 'border-white/10 opacity-60' : 'border-white/10'}`}>
      <div className={`bg-gradient-to-r ${c.color} p-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{c.emoji}</span>
          <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{c.badge}</span>
        </div>
        <h3 className="text-white font-black text-base">{c.name}</h3>
        <p className="text-white/80 font-black text-2xl mt-1">{c.discount}% OFF</p>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-white/60 text-xs leading-snug">{c.description}</p>
        {!isExpired && <CountdownBadge endsAt={c.endsAt} />}
        {isExpired && (
          <span className="text-red-400 text-xs font-semibold">Expired</span>
        )}
        {!isExpired && (
          <button
            onClick={() => router.push('/shop')}
            className={`w-full py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r ${c.color} flex items-center justify-center gap-1 mt-1`}
          >
            Shop Now <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Coupon card ───────────────────────────────────────────────────────────────

function CouponCard({ code }: { code: PromoCode }) {
  const isExpired = code.expiresAt.getTime() < Date.now();
  return (
    <div className={`card-glass rounded-2xl p-4 border ${isExpired ? 'border-white/5 opacity-50' : 'border-purple-500/20'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-black text-base font-mono tracking-widest ${isExpired ? 'text-white/40 line-through' : 'text-white'}`}>
          {code.code}
        </span>
        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
          isExpired
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {isExpired ? 'Expired' : code.type === 'percent' ? `-${code.discount}%` : `${code.discount} coins`}
        </span>
      </div>
      <p className="text-white/50 text-xs">{code.description}</p>
      {!isExpired && (
        <div className="mt-2 flex items-center justify-between">
          {code.minPurchase && (
            <span className="text-white/30 text-[10px]">Min €{code.minPurchase}</span>
          )}
          <span className="text-white/30 text-[10px] ml-auto">
            Expires: {code.expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const VALID_CODES = ['WELCOME10', 'SUMMER25', 'BOOST50', 'FRIDAY15', 'BESTIE200'];
const EXPIRED_CODES = ['VALENTINE'];

export default function DiscountsPage() {
  const router = useRouter();
  const [codeInput, setCodeInput] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'success' | 'error' | 'expired'>('idle');
  const [appliedCode, setAppliedCode] = useState<PromoCode | null>(null);
  const [myCoupons, setMyCoupons] = useState<PromoCode[]>([]);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // mock: user is Silver at €35 spent
  const currentSpend = 35;
  const currentTierIdx = 1; // Silver
  const currentTier = loyaltyTiers[currentTierIdx];
  const nextTier = loyaltyTiers[currentTierIdx + 1];
  const progressToNext = nextTier
    ? ((currentSpend - currentTier.minSpend) / (nextTier.minSpend - currentTier.minSpend)) * 100
    : 100;

  const applyCode = () => {
    const code = codeInput.trim().toUpperCase();
    if (EXPIRED_CODES.includes(code)) {
      setCodeStatus('expired');
      triggerShake();
      return;
    }
    const found = promoCodes.find((p) => p.code === code && VALID_CODES.includes(p.code));
    if (found) {
      setCodeStatus('success');
      setAppliedCode(found);
      if (!myCoupons.find((c) => c.code === code)) {
        setMyCoupons((prev) => [found, ...prev]);
      }
      setCodeInput('');
    } else {
      setCodeStatus('error');
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const activeCampaigns = campaigns.filter((c) => c.endsAt.getTime() > Date.now());
  const expiredCampaigns = campaigns.filter((c) => c.endsAt.getTime() <= Date.now());

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Tag size={20} className="text-purple-400" />
            <h1 className="text-white font-black text-xl">Deals & Discounts 🏷️</h1>
          </div>
        </div>
      </div>

      <div className="px-5 pb-24 pt-5 space-y-7">

        {/* ── Savings summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-brand rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="text-4xl">💰</div>
          <div>
            <p className="text-white font-black text-lg">You&apos;ve saved €8.50</p>
            <p className="text-white/70 text-sm">this month through deals & discounts</p>
          </div>
        </motion.div>

        {/* ── Active Campaigns ── */}
        <div>
          <h2 className="text-white font-black text-base mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-orange-400" />
            Active Campaigns
          </h2>
          {activeCampaigns.length === 0 ? (
            <p className="text-white/40 text-sm">No active campaigns right now. Check back soon!</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {activeCampaigns.map((c) => (
                <CampaignCard key={c.id} c={c} />
              ))}
            </div>
          )}

          {expiredCampaigns.length > 0 && (
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {expiredCampaigns.map((c) => (
                <CampaignCard key={c.id} c={c} />
              ))}
            </div>
          )}
        </div>

        {/* ── Promo Code Input ── */}
        <div>
          <h2 className="text-white font-black text-base mb-3 flex items-center gap-2">
            <Gift size={16} className="text-pink-400" />
            Promo Code
          </h2>
          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={codeInput}
              onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodeStatus('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && applyCode()}
              placeholder="Enter code (e.g. SUMMER25)"
              className={`flex-1 bg-white/10 border rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none transition-colors ${
                codeStatus === 'success'
                  ? 'border-green-500/60'
                  : codeStatus === 'error' || codeStatus === 'expired'
                  ? 'border-red-500/60'
                  : 'border-white/15 focus:border-purple-500/50'
              }`}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={applyCode}
              className="gradient-brand text-white font-black px-5 py-3 rounded-xl shadow-lg text-sm"
            >
              Apply
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {codeStatus === 'success' && appliedCode && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center gap-2 text-green-400 text-sm font-semibold"
              >
                <Check size={15} />
                {appliedCode.type === 'percent'
                  ? `${appliedCode.discount}% off applied!`
                  : `${appliedCode.discount} coins added!`}
                {' '}{appliedCode.description.split('–')[0]}
              </motion.div>
            )}
            {codeStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center gap-2 text-red-400 text-sm font-semibold"
              >
                <X size={15} />
                Invalid code. Please check and try again.
              </motion.div>
            )}
            {codeStatus === 'expired' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center gap-2 text-orange-400 text-sm font-semibold"
              >
                <Clock size={15} />
                This code has expired.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── My Coupons ── */}
        {myCoupons.length > 0 && (
          <div>
            <h2 className="text-white font-black text-base mb-3 flex items-center gap-2">
              🎫 My Coupons
            </h2>
            <div className="space-y-3">
              {myCoupons.map((c) => (
                <CouponCard key={c.code} code={c} />
              ))}
            </div>
          </div>
        )}

        {/* ── All available codes (hint) ── */}
        <div>
          <h2 className="text-white font-black text-base mb-3">Available Codes</h2>
          <div className="space-y-3">
            {promoCodes.map((c) => (
              <CouponCard key={c.code} code={c} />
            ))}
          </div>
        </div>

        {/* ── Loyalty Program ── */}
        <div>
          <h2 className="text-white font-black text-base mb-3 flex items-center gap-2">
            <span>👑</span> Loyalty Program
          </h2>

          {/* Current tier display */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-r ${currentTier.color} rounded-2xl p-5 mb-4 shadow-xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/80 text-xs uppercase tracking-wider font-semibold">Your Tier</p>
                <p className="text-white font-black text-2xl">{currentTier.emoji} {currentTier.name}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-xs">Total spent</p>
                <p className="text-white font-black text-xl">€{currentSpend}</p>
              </div>
            </div>
            {nextTier && (
              <>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>€{currentSpend} spent</span>
                  <span>€{nextTier.minSpend} for {nextTier.name}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className="text-white/70 text-xs mt-1">
                  €{nextTier.minSpend - currentSpend} more to reach {nextTier.emoji} {nextTier.name}
                </p>
              </>
            )}
          </motion.div>

          {/* Tier progress visualization */}
          <div className="flex items-center gap-1 mb-4 overflow-x-auto no-scrollbar pb-1">
            {loyaltyTiers.map((tier, idx) => (
              <div key={tier.name} className="flex items-center flex-shrink-0">
                <div className={`flex flex-col items-center ${idx <= currentTierIdx ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-xl border-2 ${idx === currentTierIdx ? 'border-white scale-110' : 'border-transparent'}`}>
                    {tier.emoji}
                  </div>
                  <span className="text-white/60 text-[9px] mt-1">{tier.name}</span>
                </div>
                {idx < loyaltyTiers.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 rounded-full ${idx < currentTierIdx ? 'bg-white/60' : 'bg-white/15'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Tier cards */}
          <div className="space-y-3">
            {loyaltyTiers.map((tier, idx) => {
              const isCurrent = idx === currentTierIdx;
              const isUnlocked = idx <= currentTierIdx;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`card-glass rounded-2xl overflow-hidden border ${isCurrent ? 'border-purple-500/50' : 'border-white/10'}`}
                >
                  <div className={`bg-gradient-to-r ${tier.color} px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tier.emoji}</span>
                      <span className="text-white font-black">{tier.name}</span>
                      {isCurrent && (
                        <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full">Current</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-xs">From €{tier.minSpend}</p>
                      <p className="text-white font-bold text-sm">{tier.discount > 0 ? `${tier.discount}% off` : 'Base'}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {tier.perks.map((perk) => (
                        <span
                          key={perk}
                          className={`text-xs px-2 py-1 rounded-lg border flex items-center gap-1 ${
                            isUnlocked
                              ? 'bg-white/5 text-white/70 border-white/10'
                              : 'bg-white/5 text-white/30 border-white/5'
                          }`}
                        >
                          {isUnlocked && <Check size={10} className="text-green-400" />}
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── How to earn ── */}
        <div className="card-glass rounded-2xl p-4">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            💡 How to Earn
          </h3>
          {[
            { icon: '🛒', label: 'Make purchases', desc: 'Every euro spent counts toward your tier' },
            { icon: '👥', label: 'Invite friends', desc: 'Earn bonus coins for every friend who joins' },
            { icon: '📅', label: 'Daily login', desc: 'Claim your daily free reward every day' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 mb-3 last:mb-0">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-white/50 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Invite banner ── */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/invite')}
          className="card-glass rounded-2xl p-4 border border-purple-500/20 flex items-center gap-4 cursor-pointer"
        >
          <div className="text-3xl flex-shrink-0">🎁</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Invite Friends</p>
            <p className="text-white/50 text-xs mt-0.5">Earn coins & unlock exclusive rewards</p>
          </div>
          <ChevronRight size={16} className="text-white/30 flex-shrink-0" />
        </motion.div>

      </div>
    </div>
  );
}
