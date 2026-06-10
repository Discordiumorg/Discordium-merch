'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Crown, ShoppingCart, Check, Zap, Package,
  Gift, Sparkles, Clock, TrendingUp, ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  shopItems, flashDeals, bundles, giftItems, coinItems, defaultInventory,
  rarityConfig, diamondShopItems, diamondItems,
  type ShopItem, type Bundle, type GiftItem, type Inventory,
} from '@/lib/shopData';
import BottomNav from '@/components/BottomNav';

type Category = 'all' | 'boost' | 'superlike' | 'coins' | 'rose' | 'spotlight' | 'bundle' | 'gifts' | 'diamond';

const categoryTabs: { id: Category; label: string }[] = [
  { id: 'all',       label: '✨ All' },
  { id: 'bundle',    label: '📦 Bundles' },
  { id: 'diamond',   label: '💎 Diamonds' },
  { id: 'boost',     label: '⚡ Boosts' },
  { id: 'superlike', label: '🌟 Super Likes' },
  { id: 'spotlight', label: '🏙️ Spotlight' },
  { id: 'rose',      label: '🌹 Roses' },
  { id: 'coins',     label: '🪙 Coins' },
  { id: 'gifts',     label: '🎁 Gifts' },
];

function useCountdown(endsAt: Date) {
  const calc = () => {
    const diff = Math.max(0, endsAt.getTime() - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, expired: diff === 0 };
  };
  const [time, setTime] = useState(calc());
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  });
  return time;
}

function CountdownBadge({ endsAt }: { endsAt: Date }) {
  const { h, m, s } = useCountdown(endsAt);
  return (
    <span className="flex items-center gap-1 text-orange-400 font-mono font-bold text-xs bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">
      <Clock size={10} />
      {h > 0 ? `${h}h ` : ''}{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
    </span>
  );
}

type ModalPayload =
  | { type: 'item'; data: ShopItem }
  | { type: 'bundle'; data: Bundle }
  | { type: 'gift'; data: GiftItem };

export default function ShopPage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>('all');
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalPayload | null>(null);
  const [inventory, setInventory] = useState<Inventory>({ ...defaultInventory });
  const [sentGifts, setSentGifts] = useState<Set<string>>(new Set());
  const [successId, setSuccessId] = useState<string | null>(null);
  const [giftAnimation, setGiftAnimation] = useState<string | null>(null); // emoji for animation

  const filteredItems = category === 'all'
    ? shopItems
    : category === 'bundle' || category === 'gifts' || category === 'diamond'
    ? []
    : shopItems.filter((i) => i.category === category);

  const showBundle     = category === 'all' || category === 'bundle';
  const showFlash      = category === 'all';
  const showItems      = category !== 'bundle' && category !== 'gifts' && category !== 'diamond' && category !== 'rose' && category !== 'spotlight';
  const showGifts      = category === 'gifts' || category === 'all';
  const showDiamonds   = category === 'diamond' || category === 'all';
  const showRoses      = category === 'rose' || category === 'all';
  const showSpotlight  = category === 'spotlight' || category === 'all';

  const triggerSuccess = (id: string) => {
    setSuccessId(id);
    setTimeout(() => setSuccessId(null), 1800);
  };

  const confirmPurchase = () => {
    if (!modal) return;
    const id = modal.type === 'gift' ? modal.data.id : modal.data.id;

    if (modal.type === 'item') {
      const item = modal.data as ShopItem;
      setPurchased((p) => { const n = new Set(p); n.add(id); return n; });
      setInventory((inv) => {
        const u = { ...inv };
        if (item.category === 'coins')     u.coins      += item.amount;
        if (item.category === 'boost')     u.boosts     += item.amount;
        if (item.category === 'superlike') u.superLikes += item.amount;
        if (item.category === 'rose')      u.roses      += item.amount;
        if (item.category === 'diamond')   u.diamonds   += item.amount;
        return u;
      });
    } else if (modal.type === 'bundle') {
      setPurchased((p) => { const n = new Set(p); n.add(id); return n; });
    } else if (modal.type === 'gift') {
      const gift = modal.data as GiftItem;
      setInventory((inv) => ({ ...inv, coins: Math.max(0, inv.coins - gift.coinCost) }));
      setSentGifts((p) => { const n = new Set(p); n.add(id); return n; });
      // Trigger gift send animation
      setGiftAnimation(gift.emoji);
      setTimeout(() => setGiftAnimation(null), 2500);
    }
    triggerSuccess(id);
    setModal(null);
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-safe">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 card-glass rounded-xl flex items-center justify-center">
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-pink-400" />
              <h1 className="text-white font-black text-xl">Shop</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 card-glass px-3 py-1.5 rounded-xl">
              <span className="text-base">💎</span>
              <span className="text-cyan-400 font-bold text-sm">{inventory.diamonds}</span>
            </div>
            <div className="flex items-center gap-1.5 card-glass px-3 py-1.5 rounded-xl">
              <span className="text-base">🪙</span>
              <span className="text-yellow-400 font-bold text-sm">{inventory.coins}</span>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === tab.id
                  ? 'gradient-brand text-white shadow-lg'
                  : 'card-glass text-white/60 hover:text-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-32 space-y-6 pt-5">

        {/* ── Premium Banner ── */}
        {category === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => router.push('/premium')}
            className="gradient-brand rounded-2xl p-4 flex items-center gap-4 shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">👑</div>
            <div className="flex-1">
              <p className="text-white font-black text-sm">Upgrade to Premium</p>
              <p className="text-white/80 text-xs mt-0.5">Unlimited likes · See who liked you · No ads</p>
            </div>
            <div className="flex-shrink-0 bg-white text-purple-700 text-xs font-black px-3 py-1.5 rounded-xl">
              From €8.99
            </div>
          </motion.div>
        )}

        {/* ── Inventory Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Package size={15} className="text-purple-400" />
            <h3 className="text-white font-bold text-sm">My Inventory</h3>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              { emoji: '⚡', label: 'Boosts',      value: inventory.boosts,     color: 'text-orange-400' },
              { emoji: '🌟', label: 'S.Likes',     value: inventory.superLikes, color: 'text-blue-400' },
              { emoji: '🪙', label: 'Coins',        value: inventory.coins,      color: 'text-yellow-400' },
              { emoji: '🌹', label: 'Roses',        value: inventory.roses,      color: 'text-red-400' },
              { emoji: '💎', label: 'Diamonds',     value: inventory.diamonds,   color: 'text-cyan-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                <div className="text-xl mb-1">{stat.emoji}</div>
                <p className={`${stat.color} font-black text-base`}>{stat.value}</p>
                <p className="text-white/30 text-[9px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Flash Deals ── */}
        {showFlash && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-orange-400" />
              <h2 className="text-white font-black text-base">⚡ Flash Deals</h2>
              <span className="text-white/40 text-xs ml-auto">Limited stock!</span>
            </div>
            <div className="space-y-3">
              {flashDeals.map((deal, i) => {
                const isBought = purchased.has(deal.item.id);
                const stockPct = (deal.stockLeft / deal.totalStock) * 100;
                return (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="card-glass rounded-2xl overflow-hidden border border-orange-500/20"
                  >
                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/10 px-4 py-2 flex items-center justify-between">
                      <span className="text-orange-400 text-xs font-bold uppercase tracking-wide">Flash Deal</span>
                      <CountdownBadge endsAt={deal.endsAt} />
                    </div>
                    <div className="p-4 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deal.item.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                        {deal.item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white font-bold text-sm">{deal.item.name}</p>
                          <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{deal.item.badge}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-black text-base">€{deal.item.price.toFixed(2)}</span>
                          <span className="text-white/30 text-xs line-through">€{deal.item.originalPrice?.toFixed(2)}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-white/40">{deal.stockLeft} left</span>
                            <span className="text-orange-400">{deal.totalStock - deal.stockLeft} sold</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${100 - stockPct}%` }}
                              transition={{ delay: 0.4, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => !isBought && setModal({ type: 'item', data: deal.item })}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black ${
                          isBought
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        }`}
                      >
                        {isBought ? <Check size={14} /> : 'Grab it'}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Bundles ── */}
        {showBundle && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package size={16} className="text-purple-400" />
              <h2 className="text-white font-black text-base">📦 Value Bundles</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {bundles.map((bundle, i) => {
                const isBought = purchased.has(bundle.id);
                return (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="card-glass rounded-2xl overflow-hidden"
                  >
                    <div className={`bg-gradient-to-r ${bundle.color} p-4 relative`}>
                      <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-black px-2 py-0.5 rounded-full">
                        {bundle.badge}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{bundle.emoji}</div>
                        <div>
                          <p className="text-white font-black text-lg leading-tight">{bundle.name}</p>
                          <p className="text-white/80 text-xs">{bundle.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bundle.contents.map((c) => (
                          <span key={c.label} className="flex items-center gap-1 bg-white/5 text-white/70 text-xs px-3 py-1.5 rounded-xl">
                            {c.emoji} {c.label}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white font-black text-xl">€{bundle.price.toFixed(2)}</span>
                          <span className="text-white/30 text-sm line-through ml-2">€{bundle.originalPrice.toFixed(2)}</span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => !isBought && setModal({ type: 'bundle', data: bundle })}
                          className={`px-5 py-2.5 rounded-xl text-sm font-black ${
                            isBought
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : `bg-gradient-to-r ${bundle.color} text-white shadow-lg`
                          }`}
                        >
                          {isBought ? '✓ Owned' : 'Buy Bundle'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Regular Items ── */}
        {showItems && filteredItems.length > 0 && (
          <div>
            {category !== 'all' && (
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-purple-400" />
                <h2 className="text-white font-black text-base capitalize">{categoryTabs.find(t => t.id === category)?.label}</h2>
              </div>
            )}
            {category === 'all' && (
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-purple-400" />
                <h2 className="text-white font-black text-base">All Items</h2>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3">
              {filteredItems.map((item, i) => {
                const isBought = purchased.has(item.id);
                const tagStyles: Record<string, string> = {
                  hot:        'bg-red-500',
                  new:        'bg-green-500',
                  limited:    'bg-orange-500',
                  bestseller: 'bg-purple-500',
                };
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="card-glass rounded-2xl overflow-hidden"
                  >
                    <div className={`bg-gradient-to-r ${item.color} h-1`} />
                    <div className="p-4 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className="text-white font-bold text-sm">{item.name}</p>
                          {item.badge && (
                            <span className="bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>
                          )}
                          {item.tag && (
                            <span className={`${tagStyles[item.tag]} text-white text-[9px] font-black px-1.5 py-0.5 rounded-full capitalize`}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-white/50 text-xs leading-tight mb-1.5">{item.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-black text-base">€{item.price.toFixed(2)}</span>
                          {item.originalPrice && (
                            <span className="text-white/30 text-xs line-through">€{item.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => !isBought && setModal({ type: 'item', data: item })}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black ${
                          isBought
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        }`}
                      >
                        {isBought ? <span className="flex items-center gap-1"><Check size={12}/> Owned</span> : 'Buy'}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Spotlight Purchase ── */}
        {showSpotlight && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏙️</span>
              <h2 className="text-white font-black text-base">Spotlight</h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glass rounded-2xl overflow-hidden border border-yellow-500/20"
            >
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/10 px-4 py-2 flex items-center justify-between">
                <span className="text-yellow-400 text-xs font-bold">🔦 30-min Spotlight</span>
                <span className="text-white/40 text-xs">234 users in next spotlight</span>
              </div>
              <div className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                  🔦
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm mb-0.5">30-min Spotlight</p>
                  <p className="text-white/50 text-xs mb-2">Get boosted to the top of everyone&apos;s feed for 30 minutes</p>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-black text-base">200 🪙</span>
                    <span className="text-white/30 text-xs">or</span>
                    <span className="text-white font-black text-base">€2.99</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setInventory((inv) => ({ ...inv, coins: Math.max(0, inv.coins - 200) }))}
                  className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                >
                  Activate
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Rose Tiers ── */}
        {showRoses && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌹</span>
              <h2 className="text-white font-black text-base">Roses</h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  id: 'silver-rose',
                  emoji: '🌷',
                  name: 'Silver Rose',
                  desc: 'Express interest',
                  coins: 50,
                  color: 'from-slate-400 to-slate-500',
                  glow: 'rgba(148,163,184,0.3)',
                },
                {
                  id: 'gold-rose',
                  emoji: '🌹',
                  name: 'Gold Rose',
                  desc: 'Show you\'re serious',
                  coins: 150,
                  color: 'from-yellow-400 to-amber-500',
                  glow: 'rgba(234,179,8,0.3)',
                },
                {
                  id: 'crystal-rose',
                  emoji: '💎',
                  name: 'Crystal Rose',
                  desc: 'Make them feel special',
                  coins: 500,
                  color: 'from-cyan-400 to-blue-500',
                  glow: 'rgba(6,182,212,0.3)',
                },
              ].map((rose, i) => (
                <motion.div
                  key={rose.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ boxShadow: `0 0 20px ${rose.glow}` }}
                  className="card-glass rounded-2xl p-4 flex items-center gap-4 cursor-pointer border border-white/10 transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rose.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                    {rose.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{rose.name}</p>
                    <p className="text-white/50 text-xs">{rose.desc}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setInventory((inv) => ({ ...inv, coins: Math.max(0, inv.coins - rose.coins) }))}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r ${rose.color} text-white shadow-lg`}
                  >
                    {rose.coins} 🪙
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Virtual Gifts ── */}
        {showGifts && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gift size={16} className="text-pink-400" />
              <h2 className="text-white font-black text-base">🎁 Virtual Gifts</h2>
            </div>
            <p className="text-white/40 text-xs mb-3">Send gifts to matches — paid with your Coins</p>

            {/* Rarity legend */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {(['common','rare','epic','legendary'] as const).map((r) => (
                <span key={r} className={`text-[10px] font-semibold px-2 py-1 rounded-lg border ${rarityConfig[r].color} ${rarityConfig[r].bg} ${rarityConfig[r].border}`}>
                  {rarityConfig[r].label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {giftItems.map((gift, i) => {
                const isSent = sentGifts.has(gift.id);
                const canAfford = inventory.coins >= gift.coinCost;
                const rc = rarityConfig[gift.rarity];
                return (
                  <motion.button
                    key={gift.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => !isSent && setModal({ type: 'gift', data: gift })}
                    className={`card-glass rounded-2xl p-3 text-center border transition-all ${
                      isSent ? 'border-green-500/30' : rc.border
                    } ${!canAfford && !isSent ? 'opacity-50' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gift.color} flex items-center justify-center text-2xl mx-auto mb-2`}>
                      {gift.emoji}
                    </div>
                    <p className="text-white font-semibold text-xs leading-tight mb-1">{gift.name}</p>
                    <span className={`text-[9px] font-bold ${rc.color}`}>{rc.label}</span>
                    <div className="mt-2">
                      {isSent ? (
                        <span className="text-green-400 text-[10px] font-bold">Sent ✓</span>
                      ) : (
                        <span className={`text-[11px] font-black ${canAfford ? 'text-yellow-400' : 'text-white/30'}`}>
                          {gift.coinCost} 🪙
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Diamonds Section ── */}
        {showDiamonds && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💎</span>
              <h2 className="text-white font-black text-base">Diamonds</h2>
              <span className="text-white/40 text-xs ml-auto">Premium currency</span>
            </div>

            {/* Diamond items to buy */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              {diamondShopItems.map((item, i) => {
                const isBought = purchased.has(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-glass rounded-2xl overflow-hidden"
                  >
                    <div className={`bg-gradient-to-r ${item.color} h-1`} />
                    <div className="p-4 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className="text-white font-bold text-sm">{item.name}</p>
                          {item.badge && (
                            <span className="bg-cyan-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>
                          )}
                          {item.tag && (
                            <span className={`${item.tag === 'hot' ? 'bg-red-500' : item.tag === 'bestseller' ? 'bg-purple-500' : 'bg-green-500'} text-white text-[9px] font-black px-1.5 py-0.5 rounded-full capitalize`}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-white/50 text-xs leading-tight mb-1.5">{item.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-black text-base">€{item.price.toFixed(2)}</span>
                          {item.originalPrice && (
                            <span className="text-white/30 text-xs line-through">€{item.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => !isBought && setModal({ type: 'item', data: item })}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black ${
                          isBought
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        }`}
                      >
                        {isBought ? <span className="flex items-center gap-1"><Check size={12}/> Owned</span> : 'Buy'}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Diamond spend table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-glass rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💎</span>
                <h3 className="text-white font-bold text-sm">Spend Your Diamonds</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {diamondItems.map((di) => (
                  <div key={di.action} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
                    <span className="text-white/70 text-xs flex items-center gap-1.5">{di.emoji} {di.action}</span>
                    <span className="text-cyan-400 font-bold text-xs">{di.diamonds} 💎</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Coin Spend Table ── */}
        {(category === 'all' || category === 'coins') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glass rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🪙</span>
              <h3 className="text-white font-bold text-sm">Spend Your Coins</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {coinItems.map((ci) => (
                <div key={ci.action} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
                  <span className="text-white/70 text-xs flex items-center gap-1.5">{ci.emoji} {ci.action}</span>
                  <span className="text-yellow-400 font-bold text-xs">{ci.coins} 🪙</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Daily Free Rewards ── */}
        {category === 'all' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glass rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" />
                Daily Free Rewards
              </h3>
              <span className="text-white/40 text-xs">Resets in 14h 32m</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: '💛', label: 'Daily Likes', sub: '15 left', claimable: false },
                { emoji: '🌟', label: 'Super Like', sub: '1 left', claimable: false },
                { emoji: '🪙', label: '10 Coins', sub: 'Claim now', claimable: true },
              ].map((reward) => (
                <motion.button
                  key={reward.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => reward.claimable && setInventory((inv) => ({ ...inv, coins: inv.coins + 10 }))}
                  className={`rounded-xl p-3 text-center border transition-all ${
                    reward.claimable
                      ? 'card-glass border-yellow-500/40 hover:border-yellow-400/60'
                      : 'card-glass border-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{reward.emoji}</div>
                  <p className="text-white text-xs font-semibold">{reward.label}</p>
                  <p className={`text-[10px] ${reward.claimable ? 'text-yellow-400 font-bold' : 'text-white/40'}`}>{reward.sub}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Deals & Coupons Banner ── */}
        {category === 'all' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => router.push('/discounts')}
            className="card-glass rounded-2xl p-4 border border-orange-500/20 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl flex-shrink-0">🏷️</div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Deals & Coupons</p>
                <p className="text-white/50 text-xs mt-0.5">Summer Sale: <span className="text-orange-400 font-bold">30% OFF</span> — 3 days left!</p>
              </div>
              <ChevronRight size={16} className="text-white/30 flex-shrink-0" />
            </div>
          </motion.div>
        )}

        {/* ── Referral / Invite Banner ── */}
        {category === 'all' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => router.push('/invite')}
            className="card-glass rounded-2xl p-4 border border-purple-500/20 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl flex-shrink-0">👥</div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Invite Friends</p>
                <p className="text-white/50 text-xs mt-0.5">Get <span className="text-yellow-400 font-bold">200 Coins</span> for every friend who joins</p>
              </div>
              <ChevronRight size={16} className="text-white/30 flex-shrink-0" />
            </div>
          </motion.div>
        )}

      </div>

      {/* ── Gift Send Animation ── */}
      <AnimatePresence>
        {giftAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-none"
          >
            {/* Particle dots */}
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * 360;
              const rad = (angle * Math.PI) / 180;
              const dist = 120 + Math.random() * 60;
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(rad) * dist,
                    y: Math.sin(rad) * dist,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: ['#ec4899', '#7c3aed', '#f59e0b', '#10b981'][i % 4],
                    left: '50%',
                    top: '50%',
                    marginLeft: -6,
                    marginTop: -6,
                  }}
                />
              );
            })}
            {/* Gift emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="text-8xl mb-6"
            >
              {giftAnimation}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white font-black text-xl"
            >
              Gift sent to Sofia! 🎁
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {successId && (
          <motion.div
            key={successId}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
          >
            <Check size={16} />
            Purchase successful!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Purchase Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-brand-card rounded-t-3xl p-6 border-t border-white/10"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

              {modal.type === 'item' && (
                <>
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${modal.data.color} flex items-center justify-center text-4xl mx-auto mb-4`}>
                      {modal.data.emoji}
                    </div>
                    <h3 className="text-white font-black text-xl mb-1">{modal.data.name}</h3>
                    <p className="text-white/50 text-sm">{(modal.data as ShopItem).description}</p>
                  </div>
                  <div className="card-glass rounded-2xl p-4 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Price</span>
                      <span className="text-white font-black text-lg">€{modal.data.price.toFixed(2)}</span>
                    </div>
                    {(modal.data as ShopItem).originalPrice && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-white/40 text-xs">You save</span>
                        <span className="text-green-400 font-semibold text-sm">
                          €{((modal.data as ShopItem).originalPrice! - modal.data.price).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {modal.type === 'bundle' && (
                <>
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{modal.data.emoji}</div>
                    <h3 className="text-white font-black text-xl mb-1">{modal.data.name}</h3>
                    <p className="text-white/50 text-sm">{(modal.data as Bundle).description}</p>
                  </div>
                  <div className="card-glass rounded-2xl p-4 mb-4">
                    <p className="text-white/40 text-xs mb-2 uppercase tracking-wide">Includes</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(modal.data as Bundle).contents.map((c) => (
                        <span key={c.label} className="bg-white/5 text-white/70 text-xs px-2.5 py-1 rounded-xl">
                          {c.emoji} {c.label}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-3">
                      <span className="text-white/60 text-sm">Total</span>
                      <div className="text-right">
                        <span className="text-white font-black text-lg">€{modal.data.price.toFixed(2)}</span>
                        <span className="text-white/30 text-sm line-through ml-2">€{(modal.data as Bundle).originalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {modal.type === 'gift' && (
                <>
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${modal.data.color} flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg`}>
                      {modal.data.emoji}
                    </div>
                    <h3 className="text-white font-black text-xl mb-1">{modal.data.name}</h3>
                    <p className="text-white/50 text-sm">{(modal.data as GiftItem).description}</p>
                    <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${rarityConfig[(modal.data as GiftItem).rarity].color} ${rarityConfig[(modal.data as GiftItem).rarity].bg}`}>
                      {rarityConfig[(modal.data as GiftItem).rarity].label}
                    </span>
                  </div>
                  <div className="card-glass rounded-2xl p-4 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Cost</span>
                      <span className="text-yellow-400 font-black text-lg">{(modal.data as GiftItem).coinCost} 🪙</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-white/40 text-xs">Your balance after</span>
                      <span className="text-white/60 text-sm">{inventory.coins - (modal.data as GiftItem).coinCost} 🪙</span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-3 rounded-2xl card-glass text-white/60 font-semibold text-sm"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmPurchase}
                  className={`flex-1 py-3 rounded-2xl bg-gradient-to-r ${modal.data.color} text-white font-black text-sm shadow-lg`}
                >
                  {modal.type === 'gift' ? 'Send Gift 🎁' : 'Confirm Purchase'}
                </motion.button>
              </div>

              <p className="text-white/20 text-[10px] text-center mt-3">
                Secure payment · Cancel anytime · Demo mode
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
