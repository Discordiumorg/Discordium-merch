import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Item definitions matching the shop
const ITEMS: Record<string, {
  name: string;
  price: number;
  coins?: number;
  diamonds?: number;
  boosts?: number;
  superLikes?: number;
  roses?: number;
  premiumTier?: string;
  premiumDays?: number;
}> = {
  // Coins
  'coins-100':  { name: '100 Coins',   price: 0.99,  coins: 100 },
  'coins-500':  { name: '500 Coins',   price: 3.99,  coins: 500 },
  'coins-2000': { name: '2000 Coins',  price: 12.99, coins: 2000 },
  'coins-5000': { name: '5000 Coins',  price: 24.99, coins: 5000 },
  // Boosts
  'boost-1':    { name: '1 Boost',     price: 3.99,  boosts: 1 },
  'boost-5':    { name: '5 Boosts',    price: 15.99, boosts: 5 },
  'boost-15':   { name: '15 Boosts',   price: 34.99, boosts: 15 },
  'boost-night':{ name: 'Night Boost', price: 4.99,  boosts: 1 },
  // Super Likes (shopData IDs)
  'sl-5':  { name: '5 Super Likes',  price: 4.99,  superLikes: 5 },
  'sl-25': { name: '25 Super Likes', price: 19.99, superLikes: 25 },
  'sl-60': { name: '60 Super Likes', price: 39.99, superLikes: 60 },
  // Roses (shopData IDs)
  'rose-1':  { name: '1 Rose',    price: 1.99,  roses: 1 },
  'rose-6':  { name: '6 Roses',   price: 9.99,  roses: 6 },
  'rose-24': { name: '24 Roses',  price: 29.99, roses: 24 },
  // Diamonds
  'diamonds-10':  { name: '10 Diamonds',  price: 0.99,  diamonds: 10 },
  'diamonds-50':  { name: '50 Diamonds',  price: 3.99,  diamonds: 50 },
  'diamonds-200': { name: '200 Diamonds', price: 9.99,  diamonds: 200 },
  'diamonds-500': { name: '500 Diamonds', price: 19.99, diamonds: 500 },
  // Spotlight items
  'spot-city':     { name: 'City Spotlight',       price: 6.99,  boosts: 1 },
  'spot-weekend':  { name: 'Weekend Spotlight',     price: 12.99, boosts: 2 },
  'spot-verified': { name: 'Verified Highlight',    price: 4.99,  boosts: 1 },
  'spot-top-pick': { name: 'Top Pick Badge',        price: 8.99,  boosts: 1 },
  // Flash deals
  'fd-boost-10':   { name: '10 Boosts (Flash)',     price: 9.99,  boosts: 10 },
  'fd-sl-50':      { name: '50 Super Likes (Flash)',price: 7.99,  superLikes: 50 },
  'fd-coins-3000': { name: '3000 Coins (Flash)',    price: 9.99,  coins: 3000 },
  // Bundles
  'bundle-starter':  { name: 'Starter Pack',     price: 7.99,  coins: 200,  boosts: 3, superLikes: 10, roses: 2 },
  'bundle-weekend':  { name: 'Weekend Warrior',  price: 14.99, coins: 500,  boosts: 3, superLikes: 20, roses: 6 },
  'bundle-vip':      { name: 'VIP Pack',         price: 29.99, coins: 2000, boosts: 10, superLikes: 50, roses: 12, diamonds: 100 },
  'bundle-gift':     { name: 'Gift a Friend',    price: 9.99,  coins: 100,  superLikes: 5, roses: 3, premiumTier: 'premium', premiumDays: 7 },
  // Premium
  'premium-monthly':  { name: 'Premium Monthly',  price: 14.99, premiumTier: 'premium',  premiumDays: 30 },
  'premium-yearly':   { name: 'Premium Yearly',   price: 89.99, premiumTier: 'premium',  premiumDays: 365 },
  'platinum-monthly': { name: 'Platinum Monthly', price: 29.99, premiumTier: 'platinum', premiumDays: 30 },
  'platinum-yearly':  { name: 'Platinum Yearly',  price: 199.99, premiumTier: 'platinum', premiumDays: 365 },
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { itemId, paymentMethod = 'demo' } = await req.json();
    const item = ITEMS[itemId];
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Build update object
    const updateData: Record<string, unknown> = {};
    if (item.coins)      updateData.coins      = { increment: item.coins };
    if (item.diamonds)   updateData.diamonds   = { increment: item.diamonds };
    if (item.boosts)     updateData.boosts     = { increment: item.boosts };
    if (item.superLikes) updateData.superLikes = { increment: item.superLikes };
    if (item.roses)      updateData.roses      = { increment: item.roses };
    if (item.premiumTier) {
      updateData.premium = true;
      updateData.premiumTier = item.premiumTier;
      updateData.premiumUntil = new Date(Date.now() + (item.premiumDays ?? 30) * 24 * 60 * 60 * 1000);
    }

    // Update user + create transaction atomically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user] = await prisma.$transaction([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prisma.user.update({
        where: { id: session.userId },
        data: updateData,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prisma.transaction.create({
        data: {
          userId: session.userId,
          type: item.premiumTier ? 'subscription' : 'purchase',
          itemId,
          itemName: item.name,
          amount: item.price,
          coinsChange: item.coins ?? null,
          diamondsChange: item.diamonds ?? null,
          boostsChange: item.boosts ?? null,
          superLikesChange: item.superLikes ?? null,
          rosesChange: item.roses ?? null,
          status: 'completed',
          paymentMethod,
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      inventory: {
        coins: user.coins,
        diamonds: user.diamonds,
        boosts: user.boosts,
        superLikes: user.superLikes,
        roses: user.roses,
        premium: user.premium,
        premiumTier: user.premiumTier,
      },
    });
  } catch (err) {
    console.error('Purchase error:', err);
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 });
  }
}
