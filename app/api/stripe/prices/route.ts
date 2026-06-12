import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    premium: {
      basic: {
        monthly: process.env.STRIPE_PRICE_PREMIUM_BASIC_MONTHLY ?? '',
        yearly: process.env.STRIPE_PRICE_PREMIUM_BASIC_YEARLY ?? '',
        label: 'Premium Basic',
        monthlyPrice: 9.99,
        yearlyPrice: 79.99,
      },
      gold: {
        monthly: process.env.STRIPE_PRICE_PREMIUM_GOLD_MONTHLY ?? '',
        yearly: process.env.STRIPE_PRICE_PREMIUM_GOLD_YEARLY ?? '',
        label: 'Premium Gold',
        monthlyPrice: 19.99,
        yearlyPrice: 159.99,
      },
      platinum: {
        monthly: process.env.STRIPE_PRICE_PREMIUM_PLATINUM_MONTHLY ?? '',
        yearly: process.env.STRIPE_PRICE_PREMIUM_PLATINUM_YEARLY ?? '',
        label: 'Premium Platinum',
        monthlyPrice: 29.99,
        yearlyPrice: 239.99,
      },
    },
    coins: {
      coins100: {
        priceId: process.env.STRIPE_PRICE_COINS_100 ?? '',
        label: '100 Coins',
        price: 1.99,
        amount: 100,
      },
      coins500: {
        priceId: process.env.STRIPE_PRICE_COINS_500 ?? '',
        label: '500 Coins',
        price: 7.99,
        amount: 500,
      },
      coins1200: {
        priceId: process.env.STRIPE_PRICE_COINS_1200 ?? '',
        label: '1.200 Coins',
        price: 14.99,
        amount: 1200,
      },
      coins3000: {
        priceId: process.env.STRIPE_PRICE_COINS_3000 ?? '',
        label: '3.000 Coins',
        price: 29.99,
        amount: 3000,
      },
    },
    boosts: {
      boost1: {
        priceId: process.env.STRIPE_PRICE_BOOST ?? '',
        label: '1× Boost',
        price: 2.99,
      },
    },
    superlikes: {
      superlike5: {
        priceId: process.env.STRIPE_PRICE_SUPERLIKE ?? '',
        label: '5× Super Like',
        price: 4.99,
      },
    },
  });
}
