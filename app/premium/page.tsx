'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Eye, RotateCcw, Brain, ChevronDown, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

// ─── Types ────────────────────────────────────────────────────────────────────

type BillingCycle = 'monthly' | 'yearly';

interface Feature {
  label: string;
  included: boolean;
}

interface Plan {
  id: 'basic' | 'gold' | 'platinum';
  name: string;
  emoji: string;
  badge?: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  gradient: string;
  borderClass: string;
  glowClass: string;
  features: Feature[];
}

interface Testimonial {
  name: string;
  age: number;
  quote: string;
  rating: number;
  gradientFrom: string;
  gradientTo: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    emoji: '🆓',
    monthlyPrice: null,
    yearlyPrice: null,
    gradient: 'from-gray-700 to-gray-600',
    borderClass: 'border-white/20',
    glowClass: '',
    features: [
      { label: '10 Swipes/Tag', included: true },
      { label: '1 SuperLike/Woche', included: true },
      { label: 'Basis-Matching', included: true },
      { label: 'Unlimitierte Swipes', included: false },
      { label: 'Sehen wer dich liked', included: false },
      { label: 'Rewind', included: false },
      { label: 'Boost', included: false },
      { label: 'Keine Werbung', included: false },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    emoji: '✨',
    badge: 'Beliebt',
    monthlyPrice: 9.99,
    yearlyPrice: 7.99,
    gradient: 'from-purple-700 to-pink-600',
    borderClass: 'border-purple-500/60',
    glowClass: 'glow-purple',
    features: [
      { label: 'Unlimitierte Swipes', included: true },
      { label: '5 SuperLikes/Tag', included: true },
      { label: 'Sehen wer dich liked', included: true },
      { label: 'Rewind', included: true },
      { label: 'Boost 1x/Woche', included: true },
      { label: 'Keine Werbung', included: true },
      { label: 'KI-Dating-Coach', included: false },
      { label: 'Exklusive Badges', included: false },
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    emoji: '💎',
    monthlyPrice: 19.99,
    yearlyPrice: 13.99,
    gradient: 'from-yellow-600 to-amber-500',
    borderClass: 'border-yellow-500/60',
    glowClass: '',
    features: [
      { label: 'Alles aus Gold', included: true },
      { label: 'Priorität im Matching', included: true },
      { label: 'KI-Dating-Coach', included: true },
      { label: 'Profil-Hervorhebung', included: true },
      { label: 'Unlimitierte Boosts', included: true },
      { label: 'Exklusive Badges', included: true },
      { label: 'Speed Dating VIP', included: true },
      { label: 'Premium Support', included: true },
    ],
  },
];

const testimonials: Testimonial[] = [
  {
    name: 'Sara',
    age: 28,
    quote: 'Innerhalb einer Woche hatte ich 3 echte Dates!',
    rating: 5,
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-500',
  },
  {
    name: 'Max',
    age: 31,
    quote: 'Gold hat mein Dating-Leben komplett verändert.',
    rating: 5,
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-violet-500',
  },
  {
    name: 'Jana',
    age: 25,
    quote: 'Der KI-Coach ist unglaublich hilfreich!',
    rating: 5,
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-orange-400',
  },
];

const featureHighlights = [
  {
    icon: Zap,
    title: 'Profilboost',
    description: 'Werde für 30 Minuten ganz oben in den Ergebnissen angezeigt.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: Eye,
    title: 'Wer mag dich',
    description: 'Sieh genau, wer dein Profil geliked hat – keine Rätsel mehr.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: RotateCcw,
    title: 'Rewind',
    description: 'Versehentlich geswipt? Mach den letzten Swipe rückgängig.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Brain,
    title: 'KI-Dating-Coach',
    description: 'Personalisierte Tipps für bessere Gesprächseinstiege & Dates.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
];

const faqItems: FaqItem[] = [
  {
    question: 'Wann wird abgerechnet?',
    answer: 'Bei monatlicher Abrechnung wird am selben Tag jeden Monat abgebucht. Bei jährlicher Abrechnung einmal im Jahr zum günstigeren Preis.',
  },
  {
    question: 'Kann ich kündigen?',
    answer: 'Ja, jederzeit und ohne Angabe von Gründen. Du behältst alle Premium-Vorteile bis zum Ende des bezahlten Zeitraums.',
  },
  {
    question: 'Was ist ein Boost?',
    answer: 'Ein Boost hebt dein Profil für 30 Minuten ganz oben in der Entdecken-Liste an – so siehst du bis zu 10x mehr potenzielle Matches.',
  },
  {
    question: 'Ist meine Zahlung sicher?',
    answer: 'Ja, alle Zahlungen laufen über verschlüsselte, PCI-DSS-konforme Systeme. Wir speichern keine Kartendaten direkt auf unseren Servern.',
  },
  {
    question: 'Was passiert nach Ablauf?',
    answer: 'Dein Konto wechselt automatisch zurück in den Basic-Tarif. Alle gespeicherten Matches und Nachrichten bleiben erhalten.',
  },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function FaqAccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="card-glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-white font-semibold text-sm pr-4">{item.question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-white/50 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-white/60 text-sm leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PremiumPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<BillingCycle>('yearly');
  const [showStickyCta, setShowStickyCta] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [stripeLoading, setStripeLoading] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePlanBuy = async (planId: 'basic' | 'gold' | 'platinum') => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
    if (!publishableKey || publishableKey === 'pk_test_replace_with_real_key') {
      showToast('Stripe nicht konfiguriert');
      return;
    }

    setStripeLoading(planId);
    try {
      const pricesRes = await fetch('/api/stripe/prices');
      const prices = await pricesRes.json() as {
        premium: {
          basic: { monthly: string; yearly: string };
          gold: { monthly: string; yearly: string };
          platinum: { monthly: string; yearly: string };
        };
      };

      const cycle = billing === 'yearly' ? 'yearly' : 'monthly';
      const priceId = prices.premium[planId][cycle];

      if (!priceId || priceId === 'price_replace') {
        showToast('Stripe nicht konfiguriert');
        return;
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: 'guest', type: 'premium' }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        showToast(data.error ?? 'Checkout fehlgeschlagen');
        return;
      }
      window.location.href = data.url;
    } catch {
      showToast('Netzwerkfehler – bitte versuche es erneut');
    } finally {
      setStripeLoading(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const bottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyCta(bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark overflow-x-hidden pb-safe">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">💎</span>
          <h1 className="text-white font-black text-xl">Premium</h1>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative px-5 pt-8 pb-10 text-center overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
          className="absolute -top-10 -left-10 w-60 h-60 rounded-full bg-purple-600/30 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 15, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 1.5 }}
          className="absolute -top-5 -right-16 w-56 h-56 rounded-full bg-pink-600/25 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-32 rounded-full bg-violet-700/20 blur-3xl pointer-events-none"
        />

        {/* Diamond emoji */}
        <motion.div
          animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-6xl mb-5 relative z-10"
        >
          💎
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white font-black text-2xl leading-tight mb-3 relative z-10"
        >
          Entfessle deine<br />vollen Möglichkeiten
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/55 text-sm leading-relaxed max-w-xs mx-auto relative z-10"
        >
          Bessere Matches, mehr Sichtbarkeit und exklusive Features – alles mit einem Abo.
        </motion.p>
      </div>

      <div className="px-5 pb-32">

        {/* ── Billing Toggle ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="card-glass rounded-2xl p-1.5 flex gap-1 relative">
            <motion.button
              onClick={() => setBilling('monthly')}
              className={`relative px-6 py-2 rounded-xl text-sm font-bold transition-colors ${
                billing === 'monthly' ? 'text-white' : 'text-white/45'
              }`}
            >
              {billing === 'monthly' && (
                <motion.div
                  layoutId="billingPill"
                  className="absolute inset-0 gradient-brand rounded-xl glow-button"
                />
              )}
              <span className="relative z-10">Monatlich</span>
            </motion.button>
            <motion.button
              onClick={() => setBilling('yearly')}
              className={`relative px-6 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                billing === 'yearly' ? 'text-white' : 'text-white/45'
              }`}
            >
              {billing === 'yearly' && (
                <motion.div
                  layoutId="billingPill"
                  className="absolute inset-0 gradient-brand rounded-xl glow-button"
                />
              )}
              <span className="relative z-10">Jährlich</span>
              <span className="relative z-10 bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                -33%
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── Plan Cards ─────────────────────────────────────────── */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-10 no-scrollbar -mx-5 px-5">
          {plans.map((plan, i) => {
            const price =
              plan.monthlyPrice === null
                ? null
                : billing === 'yearly'
                ? plan.yearlyPrice
                : plan.monthlyPrice;

            const isGold = plan.id === 'gold';
            const isPlatinum = plan.id === 'platinum';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className={`flex-shrink-0 w-64 rounded-2xl border-2 overflow-hidden relative ${plan.borderClass} ${isGold ? plan.glowClass : ''}`}
                style={
                  isPlatinum
                    ? { boxShadow: '0 0 24px rgba(234,179,8,0.35), 0 0 60px rgba(234,179,8,0.12)' }
                    : undefined
                }
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-3 right-3 z-10 gradient-brand text-white text-[10px] font-black px-2.5 py-1 rounded-full glow-button">
                    {plan.badge}
                  </div>
                )}

                {/* Card header */}
                <div className={`bg-gradient-to-br ${plan.gradient} px-4 pt-5 pb-4`}>
                  <div className="text-3xl mb-2">{plan.emoji}</div>
                  <p className="text-white font-black text-xl">{plan.name}</p>
                  <p className="text-white/80 text-sm mt-0.5">
                    {price === null ? (
                      <span className="font-bold">Kostenlos</span>
                    ) : (
                      <>
                        <span className="font-black text-white text-lg">€{price!.toFixed(2)}</span>
                        <span className="text-white/65 text-xs"> /Monat</span>
                        {billing === 'yearly' && (
                          <span className="text-white/55 text-xs"> (jährlich)</span>
                        )}
                      </>
                    )}
                  </p>
                </div>

                {/* Features */}
                <div className="bg-brand-card p-4 space-y-2.5">
                  {plan.features.map((feat) => (
                    <div key={feat.label} className="flex items-center gap-2.5">
                      {feat.included ? (
                        <span className="text-green-400 text-sm font-bold flex-shrink-0">✓</span>
                      ) : (
                        <span className="text-white/25 text-sm font-bold flex-shrink-0">✗</span>
                      )}
                      <span
                        className={`text-xs leading-snug ${
                          feat.included ? 'text-white/85' : 'text-white/25 line-through'
                        }`}
                      >
                        {feat.label}
                      </span>
                    </div>
                  ))}

                  {/* CTA Button */}
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ opacity: 0.9 }}
                    onClick={() => {
                      if (plan.monthlyPrice !== null) {
                        void handlePlanBuy(plan.id as 'basic' | 'gold' | 'platinum');
                      }
                    }}
                    className={`w-full mt-3 py-2.5 rounded-xl text-sm font-black transition-all ${
                      plan.monthlyPrice === null
                        ? 'bg-white/10 text-white/40 cursor-default'
                        : 'gradient-brand text-white glow-button'
                    }`}
                    disabled={plan.monthlyPrice === null || stripeLoading === plan.id}
                  >
                    {stripeLoading === plan.id ? '⏳ Bitte warten…' : plan.monthlyPrice === null ? 'Aktuell' : 'Wählen'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Testimonials ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-white font-black text-lg mb-4">Was unsere Nutzer sagen</h3>
          <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar -mx-5 px-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 w-56 card-glass rounded-2xl p-4"
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradientFrom} ${t.gradientTo} flex items-center justify-center text-white font-black text-sm mb-3`}
                >
                  {t.name[0]}
                </div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 text-xs leading-relaxed mb-3 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-white/50 text-xs font-semibold">
                  {t.name}, {t.age}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Feature Highlights ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-white font-black text-lg mb-4">Was Premium freischaltet</h3>
          <div className="grid grid-cols-2 gap-3">
            {featureHighlights.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-glass rounded-2xl p-4"
              >
                <div className={`w-9 h-9 ${f.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <f.icon size={18} className={f.color} />
                </div>
                <p className="text-white font-bold text-sm mb-1">{f.title}</p>
                <p className="text-white/50 text-xs leading-snug">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── FAQ Accordion ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-white font-black text-lg mb-4">Häufige Fragen</h3>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <FaqAccordionItem key={item.question} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Fine print ─────────────────────────────────────────── */}
        <p className="text-white/25 text-xs text-center leading-relaxed">
          Jederzeit kündbar · Sichere Zahlung · Keine versteckten Kosten
        </p>
      </div>

      {/* ── Sticky Bottom CTA ──────────────────────────────────────── */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed bottom-24 left-0 right-0 z-40 flex justify-center px-6 pointer-events-none"
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => void handlePlanBuy('gold')}
              disabled={stripeLoading === 'gold'}
              className="gradient-brand text-white font-bold py-3 px-8 rounded-2xl glow-button text-sm pointer-events-auto shadow-2xl disabled:opacity-60"
            >
              {stripeLoading === 'gold' ? '⏳ Bitte warten…' : 'Gold testen – 7 Tage kostenlos'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key={toastMsg}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl whitespace-nowrap"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
