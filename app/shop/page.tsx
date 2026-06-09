'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, ShoppingCart, Check, Coins, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { shopItems, coinItems, type ShopItem } from '@/lib/shopData';

type Category = 'all' | 'boost' | 'superlike' | 'coins' | 'rose';

const categoryLabels: Record<Category, string> = {
  all: 'All Items',
  boost: '⚡ Boosts',
  superlike: '🌟 Super Likes',
  coins: '🪙 Coins',
  rose: '🌹 Roses',
};

export default function ShopPage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>('all');
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [buyingItem, setBuyingItem] = useState<ShopItem | null>(null);
  const [coins, setCoins] = useState(150);

  const filtered = category === 'all' ? shopItems : shopItems.filter((i) => i.category === category);

  const handleBuy = (item: ShopItem) => {
    setBuyingItem(item);
  };

  const confirmBuy = () => {
    if (!buyingItem) return;
    setPurchased((prev) => {
      const next = new Set(prev);
      next.add(buyingItem.id);
      return next;
    });
    if (buyingItem.category === 'coins') {
      setCoins((c) => c + buyingItem.amount);
    }
    setBuyingItem(null);
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-pink-400" />
              <h1 className="text-white font-black text-xl">Shop</h1>
            </div>
          </div>
          {/* Coin balance */}
          <div className="flex items-center gap-2 card-glass px-3 py-1.5 rounded-xl">
            <span className="text-base">🪙</span>
            <span className="text-yellow-400 font-bold text-sm">{coins}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Premium banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => router.push('/premium')}
          className="mt-5 mb-6 gradient-brand rounded-2xl p-4 flex items-center gap-4 shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            👑
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-sm">Upgrade to Premium</p>
            <p className="text-white/80 text-xs mt-0.5">
              Unlimited likes · See who liked you · No ads
            </p>
          </div>
          <div className="flex-shrink-0 bg-white text-purple-700 text-xs font-black px-3 py-1.5 rounded-xl">
            From €8.99
          </div>
        </motion.div>

        {/* Coin store explainer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-glass rounded-2xl p-4 mb-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🪙</span>
            <h3 className="text-white font-bold text-sm">Spend Your Coins</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {coinItems.map((ci) => (
              <div key={ci.action} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                <span className="text-white/70 text-xs">{ci.action}</span>
                <span className="text-yellow-400 font-bold text-xs">{ci.coins} 🪙</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                category === cat
                  ? 'gradient-brand text-white shadow-lg'
                  : 'card-glass text-white/60 hover:text-white/80'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item, i) => {
            const isBought = purchased.has(item.id);
            const discount = item.originalPrice
              ? Math.round((1 - item.price / item.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-glass rounded-2xl overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${item.color} h-1.5`} />
                <div className="p-4 flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {item.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white font-bold text-sm">{item.name}</p>
                      {item.badge && (
                        <span className="bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs leading-tight mb-2">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black text-base">€{item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-white/30 text-xs line-through">
                          €{item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buy button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => !isBought && handleBuy(item)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                      isBought
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : `bg-gradient-to-r ${item.color} text-white shadow-lg hover:opacity-90`
                    }`}
                  >
                    {isBought ? (
                      <span className="flex items-center gap-1">
                        <Check size={12} />
                        Bought
                      </span>
                    ) : (
                      'Buy'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Daily free stuff */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 card-glass rounded-2xl p-4"
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
              { emoji: '💛', label: 'Daily Like', sub: '15 left' },
              { emoji: '🌟', label: 'Super Like', sub: '1 left' },
              { emoji: '🪙', label: '10 Coins', sub: 'Claim now' },
            ].map((reward) => (
              <motion.button
                key={reward.label}
                whileTap={{ scale: 0.95 }}
                className="card-glass rounded-xl p-3 text-center border border-white/10 hover:border-purple-500/40 transition-colors"
              >
                <div className="text-2xl mb-1">{reward.emoji}</div>
                <p className="text-white text-xs font-semibold">{reward.label}</p>
                <p className="text-white/40 text-[10px]">{reward.sub}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Buy Confirmation Modal */}
      <AnimatePresence>
        {buyingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setBuyingItem(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-brand-card rounded-t-3xl p-6 border-t border-white/10"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

              <div className="text-center mb-6">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${buyingItem.color} flex items-center justify-center text-4xl mx-auto mb-4`}
                >
                  {buyingItem.emoji}
                </div>
                <h3 className="text-white font-black text-xl mb-1">{buyingItem.name}</h3>
                <p className="text-white/50 text-sm">{buyingItem.description}</p>
              </div>

              <div className="card-glass rounded-2xl p-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Price</span>
                  <span className="text-white font-black text-lg">€{buyingItem.price.toFixed(2)}</span>
                </div>
                {buyingItem.originalPrice && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-white/40 text-xs">You save</span>
                    <span className="text-green-400 font-semibold text-sm">
                      €{(buyingItem.originalPrice - buyingItem.price).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setBuyingItem(null)}
                  className="flex-1 py-3 rounded-2xl card-glass text-white/60 font-semibold text-sm"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmBuy}
                  className={`flex-1 py-3 rounded-2xl bg-gradient-to-r ${buyingItem.color} text-white font-black text-sm shadow-lg`}
                >
                  Confirm Purchase
                </motion.button>
              </div>

              <p className="text-white/20 text-[10px] text-center mt-3">
                Secure payment · Cancel anytime · Demo mode
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
