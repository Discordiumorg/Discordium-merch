import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await (prisma as any).user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({
      coins: user.coins,
      diamonds: user.diamonds,
      boosts: user.boosts,
      superLikes: user.superLikes,
      roses: user.roses,
      premium: user.premium,
      premiumTier: user.premiumTier,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
