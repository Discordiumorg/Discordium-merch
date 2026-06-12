import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

/** Coin/item amounts granted per price ID. Adjust to match your Stripe prices. */
const PRICE_GRANTS: Record<
  string,
  {
    coins?: number;
    diamonds?: number;
    boosts?: number;
    superLikes?: number;
    roses?: number;
    premium?: boolean;
    premiumTier?: string;
    premiumDays?: number;
  }
> = {
  [process.env.STRIPE_PRICE_COINS_100 ?? '']: { coins: 100 },
  [process.env.STRIPE_PRICE_COINS_500 ?? '']: { coins: 500 },
  [process.env.STRIPE_PRICE_COINS_1200 ?? '']: { coins: 1200 },
  [process.env.STRIPE_PRICE_COINS_3000 ?? '']: { coins: 3000 },
  [process.env.STRIPE_PRICE_BOOST ?? '']: { boosts: 1 },
  [process.env.STRIPE_PRICE_SUPERLIKE ?? '']: { superLikes: 5 },
  [process.env.STRIPE_PRICE_PREMIUM_BASIC_MONTHLY ?? '']: {
    premium: true,
    premiumTier: 'basic',
    premiumDays: 31,
  },
  [process.env.STRIPE_PRICE_PREMIUM_GOLD_MONTHLY ?? '']: {
    premium: true,
    premiumTier: 'gold',
    premiumDays: 31,
  },
  [process.env.STRIPE_PRICE_PREMIUM_PLATINUM_MONTHLY ?? '']: {
    premium: true,
    premiumTier: 'platinum',
    premiumDays: 31,
  },
};

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, type, priceId } = session.metadata ?? {};

  if (!userId) {
    console.warn('[webhook] Missing userId in metadata');
    return;
  }

  const grant = PRICE_GRANTS[priceId ?? ''];
  if (!grant) {
    console.warn('[webhook] No grant configured for priceId:', priceId);
    return;
  }

  const premiumUntil =
    grant.premium && grant.premiumDays
      ? new Date(Date.now() + grant.premiumDays * 24 * 60 * 60 * 1000)
      : undefined;

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(grant.coins !== undefined && { coins: { increment: grant.coins } }),
      ...(grant.diamonds !== undefined && { diamonds: { increment: grant.diamonds } }),
      ...(grant.boosts !== undefined && { boosts: { increment: grant.boosts } }),
      ...(grant.superLikes !== undefined && { superLikes: { increment: grant.superLikes } }),
      ...(grant.roses !== undefined && { roses: { increment: grant.roses } }),
      ...(grant.premium && { premium: true }),
      ...(grant.premiumTier && { premiumTier: grant.premiumTier }),
      ...(premiumUntil && { premiumUntil }),
    },
  });

  await prisma.transaction.create({
    data: {
      userId,
      type: type ?? 'purchase',
      itemId: priceId,
      itemName: `Stripe – ${priceId}`,
      amount: (session.amount_total ?? 0) / 100,
      currency: session.currency?.toUpperCase() ?? 'EUR',
      coinsChange: grant.coins ?? 0,
      boostsChange: grant.boosts ?? 0,
      superLikesChange: grant.superLikes ?? 0,
      rosesChange: grant.roses ?? 0,
      status: 'completed',
      paymentMethod: 'stripe',
    },
  });
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
  if (!webhookSecret || webhookSecret === 'whsec_replace_with_real_secret') {
    return NextResponse.json({ error: 'Webhook nicht konfiguriert' }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Ungültige Signatur' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }
  } catch (err) {
    console.error('[webhook] handler error:', err);
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
