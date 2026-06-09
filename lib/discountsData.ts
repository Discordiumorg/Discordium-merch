export interface PromoCode {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  minPurchase?: number;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  applicableTo: 'all' | 'premium' | 'shop';
  description: string;
}

export interface Campaign {
  id: string;
  name: string;
  emoji: string;
  description: string;
  discount: number;
  endsAt: Date;
  color: string;
  badge: string;
  applicableCategories: string[];
}

export interface LoyaltyTier {
  name: string;
  emoji: string;
  minSpend: number;
  color: string;
  perks: string[];
  discount: number;
}

export interface RewardTier {
  friends: number;
  reward: string;
  emoji: string;
  coins?: number;
  premium?: string;
  unlocked: boolean;
}

export interface InvitedFriend {
  name: string;
  emoji: string;
  joinedAt: Date;
  rewardEarned: string;
  status: 'joined' | 'pending';
}

const now = Date.now();

// ─── Promo Codes ──────────────────────────────────────────────────────────────

export const promoCodes: PromoCode[] = [
  {
    code: 'WELCOME10',
    discount: 10,
    type: 'percent',
    maxUses: 1000,
    usedCount: 342,
    expiresAt: new Date(now + 30 * 86400000),
    applicableTo: 'all',
    description: '10% off your first purchase – welcome to Discordium!',
  },
  {
    code: 'SUMMER25',
    discount: 25,
    type: 'percent',
    minPurchase: 10,
    maxUses: 500,
    usedCount: 471,
    expiresAt: new Date(now + 2 * 86400000),
    applicableTo: 'all',
    description: '25% summer discount on any order over €10. Expiring soon!',
  },
  {
    code: 'BOOST50',
    discount: 50,
    type: 'percent',
    maxUses: 200,
    usedCount: 88,
    expiresAt: new Date(now + 7 * 86400000),
    applicableTo: 'shop',
    description: '50% off all Boost purchases this week.',
  },
  {
    code: 'VALENTINE',
    discount: 20,
    type: 'percent',
    maxUses: 999,
    usedCount: 999,
    expiresAt: new Date(now - 120 * 86400000), // expired
    applicableTo: 'all',
    description: '20% off everything for Valentine\'s Week.',
  },
  {
    code: 'FRIDAY15',
    discount: 15,
    type: 'percent',
    maxUses: 300,
    usedCount: 54,
    expiresAt: new Date(now + 14 * 86400000),
    applicableTo: 'shop',
    description: '15% off on Fridays – the perfect pre-weekend treat.',
  },
  {
    code: 'BESTIE200',
    discount: 200,
    type: 'fixed',
    maxUses: 100,
    usedCount: 22,
    expiresAt: new Date(now + 60 * 86400000),
    applicableTo: 'all',
    description: 'Referral reward: earn 200 Coins when a friend joins.',
  },
];

// ─── Campaigns ────────────────────────────────────────────────────────────────

export const campaigns: Campaign[] = [
  {
    id: 'camp-summer',
    name: 'Summer Sale',
    emoji: '☀️',
    description: 'Hot deals for hot summer days — 30% off all shop items for a limited time.',
    discount: 30,
    endsAt: new Date(now + 3 * 86400000),
    color: 'from-orange-500 to-yellow-500',
    badge: '3 days left!',
    applicableCategories: ['boost', 'superlike', 'coins', 'rose', 'spotlight', 'bundle'],
  },
  {
    id: 'camp-valentine',
    name: "Valentine's Week",
    emoji: '💝',
    description: '20% off everything during Valentine\'s week. Spread the love!',
    discount: 20,
    endsAt: new Date(now - 118 * 86400000), // expired
    color: 'from-pink-500 to-red-500',
    badge: 'Expired',
    applicableCategories: ['all'],
  },
  {
    id: 'camp-weekend',
    name: 'Weekend Warrior',
    emoji: '⚡',
    description: '15% off all Boosts every Friday through Sunday. Dominate the weekend.',
    discount: 15,
    endsAt: new Date(now + 5 * 86400000),
    color: 'from-purple-600 to-pink-500',
    badge: 'Active now',
    applicableCategories: ['boost'],
  },
  {
    id: 'camp-newuser',
    name: 'New User Welcome',
    emoji: '🎁',
    description: '40% off your very first purchase. Start your journey with a bang!',
    discount: 40,
    endsAt: new Date(now + 90 * 86400000),
    color: 'from-green-500 to-teal-500',
    badge: 'Always active',
    applicableCategories: ['all'],
  },
];

// ─── Loyalty Tiers ────────────────────────────────────────────────────────────

export const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    emoji: '🥉',
    minSpend: 0,
    color: 'from-amber-700 to-amber-500',
    perks: ['Access to all features', 'Standard support', 'Monthly newsletter'],
    discount: 0,
  },
  {
    name: 'Silver',
    emoji: '🥈',
    minSpend: 50,
    color: 'from-gray-400 to-gray-300',
    perks: ['5% permanent discount', 'Priority support', 'Early access to flash deals', 'Monthly bonus coins'],
    discount: 5,
  },
  {
    name: 'Gold',
    emoji: '🥇',
    minSpend: 150,
    color: 'from-yellow-500 to-amber-400',
    perks: ['10% permanent discount', 'VIP support', 'Exclusive Gold deals', '2× daily coin bonus', 'Free boost monthly'],
    discount: 10,
  },
  {
    name: 'Diamond',
    emoji: '💎',
    minSpend: 400,
    color: 'from-cyan-400 to-blue-500',
    perks: ['15% permanent discount', 'Dedicated account manager', 'Diamond-only events', '3× daily coin bonus', '3 free boosts monthly', 'Profile highlight badge'],
    discount: 15,
  },
];

// ─── Reward Tiers (Invite system) ─────────────────────────────────────────────

export const rewardTiers: RewardTier[] = [
  {
    friends: 1,
    reward: '200 Coins',
    emoji: '🪙',
    coins: 200,
    unlocked: true,
  },
  {
    friends: 3,
    reward: '500 Coins + 1 Boost',
    emoji: '⚡',
    coins: 500,
    unlocked: true,
  },
  {
    friends: 5,
    reward: '1000 Coins + 3 Day Premium',
    emoji: '🌟',
    coins: 1000,
    premium: '3 days Premium',
    unlocked: false,
  },
  {
    friends: 10,
    reward: '2000 Coins + 1 Week Premium',
    emoji: '👑',
    coins: 2000,
    premium: '1 week Premium',
    unlocked: false,
  },
  {
    friends: 25,
    reward: '1 Month Premium Free',
    emoji: '💎',
    premium: '1 month Premium',
    unlocked: false,
  },
];

// ─── Invited Friends ──────────────────────────────────────────────────────────

export const invitedFriends: InvitedFriend[] = [
  {
    name: 'Anna',
    emoji: '👩‍🦳',
    joinedAt: new Date(now - 12 * 86400000),
    rewardEarned: '200 Coins',
    status: 'joined',
  },
  {
    name: 'Tom',
    emoji: '🧔',
    joinedAt: new Date(now - 7 * 86400000),
    rewardEarned: '200 Coins',
    status: 'joined',
  },
  {
    name: 'Sophie',
    emoji: '👩‍🎨',
    joinedAt: new Date(now - 2 * 86400000),
    rewardEarned: '500 Coins + 1 Boost',
    status: 'joined',
  },
  {
    name: 'Lukas',
    emoji: '🧑‍💻',
    joinedAt: new Date(now - 1 * 86400000),
    rewardEarned: 'Pending',
    status: 'pending',
  },
];
