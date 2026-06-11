export type PlanId = 'free' | 'premium' | 'platinum';

export interface Plan {
  id: PlanId;
  name: string;
  emoji: string;
  monthlyPrice: number;
  yearlyPrice: number;
  color: string;
  gradient: string;
  badge?: string;
  features: { label: string; included: boolean; highlight?: boolean }[];
}

export type ShopCategory = 'boost' | 'superlike' | 'coins' | 'rose' | 'gift' | 'spotlight' | 'bundle' | 'diamond';

export interface ShopItem {
  id: string;
  category: ShopCategory;
  name: string;
  description: string;
  emoji: string;
  price: number;
  originalPrice?: number;
  amount: number;
  unit: string;
  badge?: string;
  color: string;
  tag?: 'hot' | 'new' | 'limited' | 'bestseller';
}

export interface FlashDeal {
  id: string;
  item: ShopItem;
  endsAt: Date;
  stockLeft: number;
  totalStock: number;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  originalPrice: number;
  color: string;
  badge: string;
  contents: { emoji: string; label: string }[];
}

export interface GiftItem {
  id: string;
  name: string;
  emoji: string;
  coinCost: number;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
}

// ─── Plans ────────────────────────────────────────────────────────────────────

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    emoji: '🔓',
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: 'text-white/60',
    gradient: 'from-white/10 to-white/5',
    features: [
      { label: '15 Likes per day', included: true },
      { label: 'Basic Matching', included: true },
      { label: 'See 3 Profile Visitors', included: true },
      { label: 'Unlimited Likes', included: false },
      { label: 'See Who Liked You', included: false },
      { label: 'Unlimited Rewinds', included: false },
      { label: 'Profile Boost x1/month', included: false },
      { label: 'Super Likes x1/week', included: false },
      { label: 'Advanced Filters', included: false },
      { label: 'No Ads', included: false },
      { label: 'Read Receipts', included: false },
      { label: 'Incognito Mode', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    emoji: '⭐',
    monthlyPrice: 14.99,
    yearlyPrice: 8.99,
    color: 'text-purple-400',
    gradient: 'from-purple-600 to-pink-600',
    badge: 'Most Popular',
    features: [
      { label: 'Unlimited Likes', included: true, highlight: true },
      { label: 'See Who Liked You', included: true, highlight: true },
      { label: 'Unlimited Rewinds', included: true },
      { label: 'Profile Boost x1/month', included: true },
      { label: 'Super Likes x5/day', included: true },
      { label: 'Advanced Filters', included: true },
      { label: 'No Ads', included: true },
      { label: 'See all Profile Visitors', included: true, highlight: true },
      { label: 'Read Receipts', included: true },
      { label: 'Incognito Mode', included: false },
      { label: 'Priority Matching', included: false },
      { label: 'Profile Verification Badge', included: false },
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    emoji: '💎',
    monthlyPrice: 29.99,
    yearlyPrice: 19.99,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 via-pink-500 to-purple-600',
    badge: 'Best Value',
    features: [
      { label: 'Everything in Premium', included: true, highlight: true },
      { label: 'Incognito Mode', included: true, highlight: true },
      { label: 'Priority Matching', included: true, highlight: true },
      { label: 'Profile Verification Badge', included: true, highlight: true },
      { label: 'Super Likes x10/day', included: true },
      { label: 'Profile Boost x3/month', included: true },
      { label: 'Dedicated Support', included: true },
      { label: 'See Mutual Interests', included: true },
      { label: 'Message before Match', included: true, highlight: true },
      { label: 'Profile highlighted in search', included: true },
      { label: 'AI Match Assistant', included: true },
      { label: 'Weekly Stats Report', included: true },
    ],
  },
];

// ─── Shop Items ───────────────────────────────────────────────────────────────

export const shopItems: ShopItem[] = [
  // Boosts
  {
    id: 'boost-1',
    category: 'boost',
    name: '1 Boost',
    description: 'Top profile in your area for 30 minutes',
    emoji: '⚡',
    price: 3.99,
    amount: 1,
    unit: 'boost',
    color: 'from-orange-500 to-pink-500',
  },
  {
    id: 'boost-5',
    category: 'boost',
    name: '5 Boosts',
    description: 'Save 20% — perfect for the weekend',
    emoji: '⚡',
    price: 15.99,
    originalPrice: 19.95,
    amount: 5,
    unit: 'boosts',
    badge: '-20%',
    color: 'from-orange-500 to-pink-500',
    tag: 'bestseller',
  },
  {
    id: 'boost-night',
    category: 'boost',
    name: 'Night Boost',
    description: 'Active 8 PM–2 AM — peak discovery hours',
    emoji: '🌙',
    price: 4.99,
    amount: 1,
    unit: 'night boost',
    badge: 'New',
    color: 'from-indigo-600 to-purple-500',
    tag: 'new',
  },
  {
    id: 'boost-15',
    category: 'boost',
    name: '15 Boosts',
    description: 'Best deal — dominate your area all month',
    emoji: '⚡',
    price: 34.99,
    originalPrice: 59.85,
    amount: 15,
    unit: 'boosts',
    badge: '-42%',
    color: 'from-orange-500 to-pink-500',
    tag: 'hot',
  },

  // Super Likes
  {
    id: 'sl-5',
    category: 'superlike',
    name: '5 Super Likes',
    description: 'Stand out — they\'ll know you really liked them',
    emoji: '🌟',
    price: 4.99,
    amount: 5,
    unit: 'super likes',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'sl-25',
    category: 'superlike',
    name: '25 Super Likes',
    description: 'Show the world you\'re serious',
    emoji: '🌟',
    price: 19.99,
    originalPrice: 24.95,
    amount: 25,
    unit: 'super likes',
    badge: '-20%',
    color: 'from-blue-500 to-cyan-400',
    tag: 'bestseller',
  },
  {
    id: 'sl-60',
    category: 'superlike',
    name: '60 Super Likes',
    description: 'Two months of premium first impressions',
    emoji: '🌟',
    price: 39.99,
    originalPrice: 59.88,
    amount: 60,
    unit: 'super likes',
    badge: '-33%',
    color: 'from-blue-500 to-cyan-400',
    tag: 'hot',
  },

  // Coins
  {
    id: 'coins-100',
    category: 'coins',
    name: '100 Coins',
    description: 'Unlock premium features à la carte',
    emoji: '🪙',
    price: 0.99,
    amount: 100,
    unit: 'coins',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    id: 'coins-500',
    category: 'coins',
    name: '500 Coins',
    description: 'Great value starter pack',
    emoji: '🪙',
    price: 3.99,
    originalPrice: 4.95,
    amount: 500,
    unit: 'coins',
    badge: '-19%',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    id: 'coins-2000',
    category: 'coins',
    name: '2000 Coins',
    description: 'Maximum value — never run out',
    emoji: '🪙',
    price: 12.99,
    originalPrice: 19.80,
    amount: 2000,
    unit: 'coins',
    badge: '-34%',
    color: 'from-yellow-400 to-orange-400',
    tag: 'bestseller',
  },
  {
    id: 'coins-5000',
    category: 'coins',
    name: '5000 Coins',
    description: 'The ultimate coin stash — serious savers only',
    emoji: '🪙',
    price: 24.99,
    originalPrice: 49.50,
    amount: 5000,
    unit: 'coins',
    badge: '-49%',
    color: 'from-yellow-400 to-orange-400',
    tag: 'hot',
  },

  // Roses
  {
    id: 'rose-1',
    category: 'rose',
    name: '1 Rose',
    description: 'Send a Rose — the ultimate way to express interest',
    emoji: '🌹',
    price: 1.99,
    amount: 1,
    unit: 'rose',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'rose-6',
    category: 'rose',
    name: '6 Roses',
    description: 'A bouquet — for when one just isn\'t enough',
    emoji: '🌹',
    price: 9.99,
    originalPrice: 11.94,
    amount: 6,
    unit: 'roses',
    badge: '-16%',
    color: 'from-red-500 to-pink-500',
    tag: 'bestseller',
  },
  {
    id: 'rose-24',
    category: 'rose',
    name: '24 Roses',
    description: 'Make them feel truly special this month',
    emoji: '🌹',
    price: 29.99,
    originalPrice: 47.76,
    amount: 24,
    unit: 'roses',
    badge: '-37%',
    color: 'from-red-500 to-pink-500',
    tag: 'hot',
  },

  // Spotlight
  {
    id: 'spot-city',
    category: 'spotlight',
    name: 'City Spotlight',
    description: 'Be featured at the top for everyone in your city for 1 hour',
    emoji: '🏙️',
    price: 6.99,
    amount: 1,
    unit: 'spotlight',
    color: 'from-teal-500 to-cyan-400',
    tag: 'new',
  },
  {
    id: 'spot-weekend',
    category: 'spotlight',
    name: 'Weekend Spotlight',
    description: 'Sat & Sun prime-time visibility — max exposure',
    emoji: '🎉',
    price: 12.99,
    originalPrice: 15.99,
    amount: 1,
    unit: 'weekend spotlight',
    badge: '-19%',
    color: 'from-teal-500 to-cyan-400',
    tag: 'hot',
  },
  {
    id: 'spot-verified',
    category: 'spotlight',
    name: 'Verified Highlight',
    description: 'Gold border + verified badge on your card for 7 days',
    emoji: '✅',
    price: 4.99,
    amount: 7,
    unit: 'days',
    color: 'from-teal-500 to-cyan-400',
  },
  {
    id: 'spot-top-pick',
    category: 'spotlight',
    name: 'Top Pick Badge',
    description: 'Curated "Top Pick" label — shown to premium users first',
    emoji: '🏆',
    price: 8.99,
    amount: 3,
    unit: 'days',
    badge: 'New',
    color: 'from-teal-500 to-cyan-400',
    tag: 'new',
  },
];

// ─── Flash Deals ──────────────────────────────────────────────────────────────

const now = Date.now();

export const flashDeals: FlashDeal[] = [
  {
    id: 'fd-1',
    endsAt: new Date(now + 1000 * 60 * 60 * 3 + 1000 * 60 * 22), // 3h 22m
    stockLeft: 7,
    totalStock: 50,
    item: {
      id: 'fd-boost-10',
      category: 'boost',
      name: '10 Boosts',
      description: 'Flash deal — limited stock!',
      emoji: '⚡',
      price: 9.99,
      originalPrice: 39.90,
      amount: 10,
      unit: 'boosts',
      badge: '-75%',
      color: 'from-orange-500 to-pink-500',
      tag: 'limited',
    },
  },
  {
    id: 'fd-2',
    endsAt: new Date(now + 1000 * 60 * 47), // 47 min
    stockLeft: 3,
    totalStock: 20,
    item: {
      id: 'fd-sl-50',
      category: 'superlike',
      name: '50 Super Likes',
      description: 'Crazy deal — almost gone!',
      emoji: '🌟',
      price: 7.99,
      originalPrice: 49.90,
      amount: 50,
      unit: 'super likes',
      badge: '-84%',
      color: 'from-blue-500 to-cyan-400',
      tag: 'limited',
    },
  },
  {
    id: 'fd-3',
    endsAt: new Date(now + 1000 * 60 * 60 * 11), // 11h
    stockLeft: 19,
    totalStock: 100,
    item: {
      id: 'fd-coins-3000',
      category: 'coins',
      name: '3000 Coins',
      description: 'Today only — half price!',
      emoji: '🪙',
      price: 9.99,
      originalPrice: 29.70,
      amount: 3000,
      unit: 'coins',
      badge: '-66%',
      color: 'from-yellow-400 to-orange-400',
      tag: 'limited',
    },
  },
];

// ─── Bundles ──────────────────────────────────────────────────────────────────

export const bundles: Bundle[] = [
  {
    id: 'bundle-starter',
    name: 'Starter Pack',
    description: 'Everything you need to get your first match',
    emoji: '🚀',
    price: 7.99,
    originalPrice: 19.95,
    color: 'from-purple-600 to-pink-500',
    badge: '-60%',
    contents: [
      { emoji: '⚡', label: '3 Boosts' },
      { emoji: '🌟', label: '10 Super Likes' },
      { emoji: '🪙', label: '200 Coins' },
      { emoji: '🌹', label: '2 Roses' },
    ],
  },
  {
    id: 'bundle-weekend',
    name: 'Weekend Warrior',
    description: 'Dominate the weekend — Friday to Sunday',
    emoji: '🎉',
    price: 14.99,
    originalPrice: 39.94,
    color: 'from-orange-500 to-red-500',
    badge: '-62%',
    contents: [
      { emoji: '🌙', label: '3 Night Boosts' },
      { emoji: '🌟', label: '20 Super Likes' },
      { emoji: '🪙', label: '500 Coins' },
      { emoji: '🌹', label: '6 Roses' },
    ],
  },
  {
    id: 'bundle-vip',
    name: 'VIP Pack',
    description: 'The complete power-user kit for serious daters',
    emoji: '💎',
    price: 29.99,
    originalPrice: 89.88,
    color: 'from-yellow-500 to-pink-500',
    badge: '-67%',
    contents: [
      { emoji: '⚡', label: '10 Boosts' },
      { emoji: '🌟', label: '50 Super Likes' },
      { emoji: '🪙', label: '2000 Coins' },
      { emoji: '🌹', label: '12 Roses' },
      { emoji: '🏆', label: 'Top Pick Badge (7d)' },
      { emoji: '🏙️', label: '3 City Spotlights' },
    ],
  },
  {
    id: 'bundle-gift',
    name: 'Gift a Friend',
    description: 'Surprise someone special with a Premium week',
    emoji: '🎁',
    price: 9.99,
    originalPrice: 17.98,
    color: 'from-pink-500 to-rose-400',
    badge: '-44%',
    contents: [
      { emoji: '⭐', label: '7-day Premium trial' },
      { emoji: '🌟', label: '5 Super Likes' },
      { emoji: '🌹', label: '3 Roses' },
      { emoji: '🪙', label: '100 Coins' },
    ],
  },
];

// ─── Virtual Gifts ────────────────────────────────────────────────────────────

export const giftItems: GiftItem[] = [
  { id: 'g-heart', name: 'Heart', emoji: '❤️', coinCost: 10, description: 'A simple, heartfelt gesture', rarity: 'common', color: 'from-red-400 to-pink-400' },
  { id: 'g-fire', name: 'Fire', emoji: '🔥', coinCost: 15, description: 'Show them they\'re hot', rarity: 'common', color: 'from-orange-400 to-red-500' },
  { id: 'g-kiss', name: 'Kiss', emoji: '💋', coinCost: 20, description: 'Blow them a kiss', rarity: 'common', color: 'from-pink-400 to-rose-500' },
  { id: 'g-chocolate', name: 'Chocolates', emoji: '🍫', coinCost: 30, description: 'Sweet and classic', rarity: 'common', color: 'from-amber-700 to-amber-500' },
  { id: 'g-cocktail', name: 'Cocktail', emoji: '🍹', coinCost: 40, description: 'Buy them a virtual drink', rarity: 'rare', color: 'from-cyan-400 to-blue-400' },
  { id: 'g-rose', name: 'Golden Rose', emoji: '🌹', coinCost: 50, description: 'More special than a regular rose', rarity: 'rare', color: 'from-yellow-400 to-orange-400' },
  { id: 'g-star', name: 'Shooting Star', emoji: '🌠', coinCost: 75, description: 'You\'re making a wish', rarity: 'rare', color: 'from-indigo-400 to-purple-500' },
  { id: 'g-crown', name: 'Crown', emoji: '👑', coinCost: 100, description: 'Make them feel like royalty', rarity: 'epic', color: 'from-yellow-400 to-yellow-600' },
  { id: 'g-diamond', name: 'Diamond', emoji: '💎', coinCost: 200, description: 'The ultimate luxury gift', rarity: 'epic', color: 'from-cyan-300 to-blue-500' },
  { id: 'g-unicorn', name: 'Unicorn', emoji: '🦄', coinCost: 500, description: 'They\'re one of a kind', rarity: 'legendary', color: 'from-pink-400 via-purple-400 to-indigo-400' },
  { id: 'g-rocket', name: 'Rocket', emoji: '🚀', coinCost: 150, description: 'Take your connection to the stars', rarity: 'epic', color: 'from-gray-400 to-gray-600' },
  { id: 'g-trophy', name: 'Trophy', emoji: '🏆', coinCost: 300, description: 'They\'re a winner in your eyes', rarity: 'epic', color: 'from-yellow-300 to-amber-500' },
];

// ─── Diamond Items ────────────────────────────────────────────────────────────

export const diamondShopItems: ShopItem[] = [
  {
    id: 'diamonds-10',
    category: 'diamond',
    name: '10 Diamonds',
    description: 'Starter pack — unlock a private photo or boost',
    emoji: '💎',
    price: 0.99,
    amount: 10,
    unit: 'diamonds',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'diamonds-50',
    category: 'diamond',
    name: '50 Diamonds',
    description: 'Send gifts, unlock stories, get radar priority',
    emoji: '💎',
    price: 3.99,
    amount: 50,
    unit: 'diamonds',
    color: 'from-cyan-400 to-blue-500',
    tag: 'bestseller',
  },
  {
    id: 'diamonds-200',
    category: 'diamond',
    name: '200 Diamonds',
    description: 'Great value — save 33% vs. starter pack',
    emoji: '💎',
    price: 9.99,
    originalPrice: 14.96,
    amount: 200,
    unit: 'diamonds',
    badge: '-33%',
    color: 'from-cyan-400 to-blue-500',
    tag: 'hot',
  },
  {
    id: 'diamonds-500',
    category: 'diamond',
    name: '500 Diamonds',
    description: 'Maximum value — the ultimate diamond stash',
    emoji: '💎',
    price: 19.99,
    originalPrice: 36.25,
    amount: 500,
    unit: 'diamonds',
    badge: '-45%',
    color: 'from-cyan-400 to-blue-500',
    tag: 'hot',
  },
];

// ─── Diamond spend table ──────────────────────────────────────────────────────

export const diamondItems: { diamonds: number; action: string; emoji: string }[] = [
  { diamonds: 10, action: 'Unlock Private Photo', emoji: '🔒' },
  { diamonds: 15, action: 'Story Boost', emoji: '📖' },
  { diamonds: 20, action: 'Priority in Radar', emoji: '📡' },
  { diamonds: 50, action: 'Send Diamond Gift', emoji: '💝' },
];

// ─── Coin spend table ─────────────────────────────────────────────────────────

export const coinItems: { coins: number; action: string; emoji: string }[] = [
  { coins: 10, action: 'Super Like', emoji: '🌟' },
  { coins: 30, action: 'Profile Rewind', emoji: '↩️' },
  { coins: 50, action: 'Send a Rose', emoji: '🌹' },
  { coins: 100, action: '1 Hour Boost', emoji: '⚡' },
  { coins: 150, action: 'City Spotlight (1h)', emoji: '🏙️' },
  { coins: 200, action: 'Incognito for 1 day', emoji: '🕵️' },
];

// ─── Inventory defaults (what a new user starts with) ─────────────────────────

export interface Inventory {
  boosts: number;
  superLikes: number;
  coins: number;
  roses: number;
  diamonds: number;
}

export const defaultInventory: Inventory = {
  boosts: 1,
  superLikes: 5,
  coins: 150,
  roses: 0,
  diamonds: 5,
};

// ─── Rarity colors ────────────────────────────────────────────────────────────

export const rarityConfig = {
  common:    { label: 'Common',    color: 'text-gray-400',   bg: 'bg-gray-500/20',   border: 'border-gray-500/30' },
  rare:      { label: 'Rare',      color: 'text-blue-400',   bg: 'bg-blue-500/20',   border: 'border-blue-500/30' },
  epic:      { label: 'Epic',      color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  legendary: { label: 'Legendary', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
};
