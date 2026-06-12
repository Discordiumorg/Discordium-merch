import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

type PurchaseType = 'premium' | 'coins' | 'boost' | 'superlike';

interface CheckoutBody {
  priceId: string;
  userId: string;
  type: PurchaseType;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const { priceId, userId, type } = body;

    if (!priceId || !userId || !type) {
      return NextResponse.json({ error: 'Ungültige Parameter' }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY ?? '';
    if (!secretKey || secretKey === 'sk_test_replace_with_real_key') {
      return NextResponse.json({ error: 'Stripe nicht konfiguriert' }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: type === 'premium' ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE_URL}/shop?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/shop?payment=cancelled`,
      metadata: {
        userId,
        type,
        priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/checkout] error:', err);
    return NextResponse.json(
      { error: 'Checkout konnte nicht erstellt werden' },
      { status: 500 },
    );
  }
}
