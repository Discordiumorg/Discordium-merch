import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        location: user.location,
        photoUrl: user.photoUrl,
        coins: user.coins,
        diamonds: user.diamonds,
        boosts: user.boosts,
        superLikes: user.superLikes,
        roses: user.roses,
        premium: user.premium,
        premiumTier: user.premiumTier,
        verified: user.verified,
        isAdmin: user.isAdmin,
        isMod: user.isMod,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
