import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, age, gender } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (age && parseInt(age) < 18) {
      return NextResponse.json({ error: 'Must be 18 or older' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (prisma as any).user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await (prisma as any).user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        age: age ? parseInt(age) : null,
        gender: gender ?? null,
      },
    });

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
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
