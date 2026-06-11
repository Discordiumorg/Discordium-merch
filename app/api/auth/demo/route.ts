import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user = await prisma.user.findUnique({ where: { email: 'demo@aura.app' } });
    if (!user) {
      const hash = await bcrypt.hash('demo123', 12);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user = await prisma.user.create({
        data: {
          email: 'demo@aura.app',
          name: 'Demo User',
          passwordHash: hash,
          age: 26,
          gender: 'female',
          bio: 'Demo account — explore all features!',
          location: 'Berlin',
          photoUrl: 'https://picsum.photos/seed/demo26/400/600',
          verified: true,
          premium: true,
          premiumTier: 'platinum',
          premiumUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          coins: 500,
          diamonds: 50,
          boosts: 5,
          superLikes: 20,
          roses: 10,
        },
      });
    }
    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    await setSessionCookie(token);
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
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
    console.error('Demo login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
