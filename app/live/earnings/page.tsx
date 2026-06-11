'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, TrendingUp, Gem, Coins, Download, ChevronRight,
  Info, Clock, CheckCircle, AlertCircle, Zap, Video,
} from 'lucide-react';

// ─── Mock earnings data ─────────────────────────────────────────────────────────

const MOCK_HISTORY = [
  { id: 'h1', date: '2026-06-11', streams: 2, viewers: 1240, coins: 18400, diamonds: 9200, euros: 92.00, status: 'paid' },
  { id: 'h2', date: '2026-06-10', streams: 1, viewers: 842, coins: 7600, diamonds: 3800, euros: 38.00, status: 'paid' },
  { id: 'h3', date: '2026-06-09', streams: 3, viewers: 2100, coins: 31200, diamonds: 15600, euros: 156.00, status: 'paid' },
  { id: 'h4', date: '2026-06-08', streams: 1, viewers: 530, coins: 4100, diamonds: 2050, euros: 20.50, status: 'paid' },
  { id: 'h5', date: '2026-06-07', streams: 2, viewers: 1870, coins: 22800, diamonds: 11400, euros: 114.00, status: 'paid' },
];

const TOTAL_DIAMONDS = 42_050;
const AVAILABLE = 42_050;
const PENDING    = 8_200;

const COIN_PACKAGES = [
  { id: 'p1', coins: 65,    price: '0.99 €',  bonus: null },
  { id: 'p2', coins: 330,   price: '4.99 €',  bonus: null },
  { id: 'p3', coins: 660,   price: '9.99 €',  bonus: '+10%' },
  { id: 'p4', coins: 1320,  price: '19.99 €', bonus: '+10%' },
  { id: 'p5', coins: 3300,  price: '49.99 €', bonus: '+20%' },
  { id: 'p6', coins: 6600,  price: '99.99 €', bonus: '+30%' },
];

export default function EarningsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'earnings' | 'coins'>('earnings');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDone, setWithdrawDone] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt < 20) { showToast('Mindestbetrag: €20'); return; }
    setWithdrawDone(true);
    setTimeout(() => { setShowWithdraw(false); setWithdrawDone(false); setWithdrawAmount(''); showToast('Auszahlung beantragt ✓'); }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-bold font-display flex-1">Einnahmen & Coins</h1>
        </div>
        {/* Tabs */}
        <div className="flex px-4 pb-3 gap-2">
          {[
            { key: 'earnings', label: '💎 Meine Einnahmen' },
            { key: 'coins',    label: '🪙 Coins kaufen' },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key ? 'gradient-brand text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* ── Earnings tab ── */}
        {tab === 'earnings' && (<>
          {/* Balance cards */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-violet-600/30 to-purple-800/30 border border-purple-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Gem size={14} className="text-purple-300" />
                <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider">Diamonds</p>
              </div>
              <p className="text-2xl font-black text-white">{TOTAL_DIAMONDS.toLocaleString()}</p>
              <p className="text-purple-400/70 text-[10px] mt-0.5">≈ €{(TOTAL_DIAMONDS * 0.01).toFixed(2)}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-gradient-to-br from-green-600/30 to-emerald-800/30 border border-green-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle size={14} className="text-green-300" />
                <p className="text-green-300 text-xs font-semibold uppercase tracking-wider">Verfügbar</p>
              </div>
              <p className="text-2xl font-black text-white">€{(AVAILABLE * 0.01).toFixed(2)}</p>
              <p className="text-green-400/70 text-[10px] mt-0.5">Auszahlbar (min. €20)</p>
            </motion.div>
          </div>

          {/* Pending */}
          <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-yellow-400" />
              <div>
                <p className="text-white/80 text-sm font-semibold">In Bearbeitung</p>
                <p className="text-white/40 text-xs">Erscheint in 3–5 Werktagen</p>
              </div>
            </div>
            <p className="text-yellow-300 font-bold">€{(PENDING * 0.01).toFixed(2)}</p>
          </div>

          {/* Withdraw button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowWithdraw(true)}
            className="w-full gradient-brand glow-button text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2">
            <Download size={18} />
            Auszahlung beantragen
          </motion.button>

          {/* How it works */}
          <div className="card-glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info size={14} className="text-white/40" />
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Wie es funktioniert</p>
            </div>
            <div className="space-y-2.5">
              {[
                { emoji: '🎁', text: 'Zuschauer schicken dir Gifts (Coins)' },
                { emoji: '💎', text: '1 Coin = 0.5 Diamonds (Plattform-Gebühr 50%)' },
                { emoji: '💶', text: '100 Diamonds = €1.00 Auszahlung' },
                { emoji: '📅', text: 'Auszahlung ab €20 – Bearbeitung 3–5 Werktage' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-2.5">
                  <span className="text-lg leading-none flex-shrink-0">{item.emoji}</span>
                  <p className="text-white/60 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="card-glass rounded-2xl overflow-hidden">
            <div className="px-4 pt-4 pb-2 border-b border-white/8">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Verlauf (letzte 7 Tage)</p>
            </div>
            {MOCK_HISTORY.map((row, idx) => (
              <motion.div key={row.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <Video size={14} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white/80 text-sm font-semibold">{new Date(row.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}</p>
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded-full">Ausgezahlt</span>
                  </div>
                  <p className="text-white/35 text-xs">{row.streams} Stream{row.streams > 1 ? 's' : ''} · {row.viewers.toLocaleString()} Zuschauer · {row.coins.toLocaleString()} Coins</p>
                </div>
                <p className="text-green-400 font-bold text-sm">+€{row.euros.toFixed(2)}</p>
              </motion.div>
            ))}
          </div>
        </>)}

        {/* ── Coins tab ── */}
        {tab === 'coins' && (<>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-4 text-center">
            <p className="text-5xl mb-2">🪙</p>
            <p className="text-white font-bold text-lg">Coins kaufen</p>
            <p className="text-white/50 text-sm mt-1">Schicke deinen Lieblings-Streamern Gifts und unterstütze sie</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {COIN_PACKAGES.map((pkg, idx) => (
              <motion.button
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => showToast(`${pkg.coins} Coins für ${pkg.price} — Zahlung kommt bald!`)}
                className="card-glass rounded-2xl p-4 text-left hover:border-purple-500/40 border border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-2xl font-black text-white">🪙 {pkg.coins >= 1000 ? `${(pkg.coins / 1000).toFixed(pkg.coins % 1000 !== 0 ? 1 : 0)}K` : pkg.coins}</p>
                  {pkg.bonus && (
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/15 border border-green-500/25 px-1.5 py-0.5 rounded-full">{pkg.bonus}</span>
                  )}
                </div>
                <p className="text-white font-bold text-base">{pkg.price}</p>
                <p className="text-white/40 text-xs mt-0.5">{pkg.coins} Coins</p>
              </motion.button>
            ))}
          </div>

          <div className="card-glass rounded-2xl p-4 text-xs text-white/40 leading-relaxed">
            Coins haben keinen Geldwert und können nicht zurückgetauscht werden. Gifted Coins gehen zu 50% als Diamonds an den Creator. 1 Diamond = €0.01 Auszahlungswert.
          </div>
        </>)}
      </div>

      {/* Withdraw sheet */}
      <AnimatePresence>
        {showWithdraw && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowWithdraw(false)} className="fixed inset-0 bg-black/60 z-40" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-brand-card rounded-t-3xl z-50 px-5 pb-8 pt-5"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              {withdrawDone ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <p className="text-white font-bold text-lg">Auszahlung beantragt!</p>
                  <p className="text-white/50 text-sm mt-1">Erscheint in 3–5 Werktagen auf deinem Konto</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-white font-bold text-lg mb-1">Auszahlung</h3>
                  <p className="text-white/40 text-sm mb-4">Verfügbar: <span className="text-green-400 font-bold">€{(AVAILABLE * 0.01).toFixed(2)}</span></p>
                  <div className="relative mb-3">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">€</span>
                    <input
                      type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Betrag eingeben (min. €20)"
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/60"
                    />
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 mb-4 text-xs text-white/40">
                    Auszahlung via PayPal oder Banküberweisung. Bearbeitungszeit: 3–5 Werktage.
                  </div>
                  <button onClick={handleWithdraw}
                    className="w-full gradient-brand text-white py-3.5 rounded-xl font-bold text-base">
                    Auszahlung beantragen
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-card border border-white/15 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl z-50">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
