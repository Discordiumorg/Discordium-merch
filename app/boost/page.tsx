'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, Eye, Heart, TrendingUp, Clock, Crown } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

type BoostDuration = 15 | 30 | 60 | 180;

interface BoostPackage {
  duration: BoostDuration;
  label: string;
  price: number;
  multiplier: string;
  popular?: boolean;
}

const BOOST_PACKAGES: BoostPackage[] = [
  { duration: 15, label: '15 Minuten', price: 50, multiplier: '3×' },
  { duration: 30, label: '30 Minuten', price: 85, multiplier: '5×', popular: true },
  { duration: 60, label: '1 Stunde', price: 140, multiplier: '8×' },
  { duration: 180, label: '3 Stunden', price: 350, multiplier: '10×' },
];

const BEST_TIMES = [
  { hour: '18–20 Uhr', label: 'Feierabend', active: true },
  { hour: '20–22 Uhr', label: 'Primetime', active: true },
  { hour: '12–13 Uhr', label: 'Mittagspause', active: false },
  { hour: '22–24 Uhr', label: 'Spätabend', active: false },
];

const BOOST_HISTORY = [
  { date: '08. Jun', duration: '30 Min', views: 127, likes: 18 },
  { date: '02. Jun', duration: '15 Min', views: 64, likes: 9 },
  { date: '25. Mai', duration: '1 Std', views: 203, likes: 31 },
];

export default function BoostPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<BoostDuration>(30);
  const [coins] = useState(340);
  const [activeBoost, setActiveBoost] = useState<{ remaining: number; total: number } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  const pkg = BOOST_PACKAGES.find(p => p.duration === selected)!;
  const canAfford = coins >= pkg.price;

  const activate = () => {
    setShowConfirm(false);
    setActiveBoost({ remaining: selected * 60, total: selected * 60 });
    setJustActivated(true);
    setTimeout(() => setJustActivated(false), 3000);
  };

  const progressPct = activeBoost ? (activeBoost.remaining / activeBoost.total) * 100 : 0;
  const remainingMins = activeBoost ? Math.ceil(activeBoost.remaining / 60) : 0;

  return (
    <div className="min-h-screen bg-brand-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60"><ArrowLeft size={18} /></button>
          <h1 className="text-white font-black text-xl">⚡ Profil Boosten</h1>
          <div className="ml-auto flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-500/25 rounded-full px-3 py-1.5">
            <span className="text-yellow-400 text-sm">🪙</span>
            <span className="text-yellow-300 font-bold text-sm">{coins}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Active boost banner */}
        <AnimatePresence>
          {activeBoost && (
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="card-glass rounded-2xl p-4 border border-purple-500/40" style={{ boxShadow: '0 0 30px rgba(168,85,247,0.2)' }}>
              <div className="flex items-center gap-3 mb-3">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Zap size={24} className="text-yellow-400" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-white font-black">Boost aktiv!</p>
                  <p className="text-purple-300 text-xs">Noch {remainingMins} Minuten verbleibend</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-xl">{pkg.multiplier}</p>
                  <p className="text-white/40 text-xs">Mehr Views</p>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progressPct}%` }}
                  className="h-full gradient-brand rounded-full"
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        {!activeBoost && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="text-6xl mb-3">⚡</motion.div>
            <h2 className="text-white font-black text-xl mb-2">Werde jetzt gesehen</h2>
            <p className="text-white/50 text-sm leading-relaxed">Ein Boost platziert dein Profil ganz oben in deiner Region und sorgt für bis zu 10× mehr Profilaufrufe.</p>
          </motion.div>
        )}

        {/* Stats preview */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Eye, label: 'Ø Views', value: `${pkg.multiplier} mehr`, color: '#a855f7' },
            { icon: Heart, label: 'Ø Likes', value: '+65%', color: '#ec4899' },
            { icon: TrendingUp, label: 'Matches', value: '+40%', color: '#22c55e' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card-glass rounded-xl p-3 text-center border border-white/8">
              <Icon size={16} style={{ color }} className="mx-auto mb-1" />
              <p className="text-white font-black text-sm">{value}</p>
              <p className="text-white/40 text-[10px]">{label}</p>
            </div>
          ))}
        </div>

        {/* Package selection */}
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Boost-Dauer wählen</p>
          <div className="space-y-2">
            {BOOST_PACKAGES.map((bp) => (
              <motion.button
                key={bp.duration}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(bp.duration)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${selected === bp.duration ? 'border-purple-500/60 bg-purple-500/10' : 'card-glass border-white/8'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selected === bp.duration ? 'gradient-brand' : 'bg-white/8'}`}>
                  <Clock size={20} className={selected === bp.duration ? 'text-white' : 'text-white/40'} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold text-sm ${selected === bp.duration ? 'text-white' : 'text-white/70'}`}>{bp.label}</p>
                    {bp.popular && <span className="text-[9px] font-black bg-purple-500/25 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-full">Beliebt</span>}
                  </div>
                  <p className="text-white/40 text-xs">{bp.multiplier} mehr Profilaufrufe</p>
                </div>
                <div className="text-right">
                  <p className={`font-black text-base ${selected === bp.duration ? 'text-yellow-400' : 'text-white/60'}`}>🪙 {bp.price}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Best times */}
        <div className="card-glass rounded-2xl p-4 border border-white/8">
          <p className="text-white font-bold text-sm mb-3">⏰ Beste Zeiten zum Boosten</p>
          <div className="space-y-2">
            {BEST_TIMES.map(t => (
              <div key={t.hour} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.active ? 'bg-green-400' : 'bg-white/20'}`} />
                <span className="text-white/70 text-sm flex-1">{t.hour}</span>
                <span className={`text-xs ${t.active ? 'text-green-400 font-semibold' : 'text-white/30'}`}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Boost history */}
        {BOOST_HISTORY.length > 0 && (
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Boost-Verlauf</p>
            <div className="space-y-2">
              {BOOST_HISTORY.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="card-glass rounded-xl p-3 flex items-center gap-3 border border-white/8">
                  <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0"><Zap size={16} className="text-purple-400" /></div>
                  <div className="flex-1">
                    <p className="text-white/70 text-sm font-semibold">{h.date} · {h.duration}</p>
                    <p className="text-white/35 text-xs">{h.views} Views · {h.likes} Likes</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Premium banner */}
        <div className="card-glass rounded-2xl p-4 border border-yellow-500/20 flex items-center gap-3">
          <Crown size={20} className="text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Gold-Mitglieder erhalten 1 Boost/Woche gratis</p>
            <p className="text-white/40 text-xs">Jetzt upgraden und mehr profitieren</p>
          </div>
          <button onClick={() => router.push('/premium')} className="gradient-brand text-white text-xs font-bold px-3 py-2 rounded-xl">Gold</button>
        </div>

        {/* Activate CTA */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => canAfford ? setShowConfirm(true) : router.push('/shop')}
          className={`w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-base ${canAfford ? 'gradient-brand glow-button' : 'bg-white/10 opacity-60'}`}
        >
          <Zap size={20} />
          {canAfford ? `Boost aktivieren · 🪙 ${pkg.price}` : `Zu wenig Münzen · 🪙 ${pkg.price} benötigt`}
        </motion.button>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', stiffness: 340, damping: 28 }} className="bg-brand-card rounded-3xl p-6 w-full max-w-md">
              <div className="text-center mb-4">
                <span className="text-4xl">⚡</span>
                <p className="text-white font-black text-lg mt-2">Boost aktivieren?</p>
                <p className="text-white/50 text-sm mt-1">{pkg.label} für 🪙 {pkg.price} Münzen</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 bg-white/10 text-white/70 py-3 rounded-2xl font-semibold">Abbrechen</button>
                <button onClick={activate} className="flex-1 gradient-brand text-white font-bold py-3 rounded-2xl glow-button">Bestätigen</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {justActivated && (
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl z-50 flex items-center gap-2">
            <Zap size={16} /> Boost gestartet! Dein Profil ist jetzt ganz oben 🚀
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
