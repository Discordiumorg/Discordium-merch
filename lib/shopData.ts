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

export interface ShopItem {
  id: string;
  category: 'boost' | 'superlike' | 'coins' | 'rose';
  name: string;
  description: string;
  emoji: string;
  price: number;
  originalPrice?: number;
  amount: number;
  unit: string;
  badge?: string;
  color: string;
}

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

export const shopItems: ShopItem[] = [
  // Boosts
  {
    id: 'boost-1',
    category: 'boost',
    name: '1 Boost',
    description: 'Be the top profile in your area for 30 minutes',
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
  },
  {
    id: 'boost-15',
    category: 'boost',
    name: '15 Boosts',
    description: 'Best deal — dominate your area for a whole month',
    emoji: '⚡',
    price: 34.99,
    originalPrice: 59.85,
    amount: 15,
    unit: 'boosts',
    badge: '-42%',
    color: 'from-orange-500 to-pink-500',
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
  },
  // Coins
  {
    id: 'coins-100',
    category: 'coins',
    name: '100 Coins',
    description: 'Use coins to unlock premium features a la carte',
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
  },
];

export const coinItems: { coins: number; action: string }[] = [
  { coins: 50, action: 'Send a Rose' },
  { coins: 30, action: 'Profile Rewind' },
  { coins: 100, action: '1 Hour Boost' },
  { coins: 10, action: 'Super Like' },
  { coins: 200, action: 'Incognito for 1 day' },
];
