import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { action, coinCost, itemId, itemName } = await req.json();
    if (!action || typeof coinCost !== 'number' || coinCost <= 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.coins < coinCost) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 402 });
    }

    const [updated] = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.userId },
        data: { coins: { decrement: coinCost } },
      }),
      prisma.transaction.create({
        data: {
          userId: session.userId,
          type: 'coin_spend',
          itemId: itemId ?? action,
          itemName: itemName ?? action,
          amount: 0,
          coinsChange: -coinCost,
          status: 'completed',
          paymentMethod: 'coins',
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      inventory: {
        coins: updated.coins,
        diamonds: updated.diamonds,
        boosts: updated.boosts,
        superLikes: updated.superLikes,
        roses: updated.roses,
        premium: updated.premium,
        premiumTier: updated.premiumTier,
      },
    });
  } catch (err) {
    console.error('Spend coins error:', err);
    return NextResponse.json({ error: 'Transaction failed' }, { status: 500 });
  }
}
