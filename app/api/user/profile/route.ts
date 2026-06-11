import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const body = await req.json();
    const allowed = ['name', 'bio', 'location', 'gender', 'age', 'photoUrl', 'goal', 'interestedIn', 'interests', 'onboarded'];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) data[key] = body[key];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await prisma.user.update({
      where: { id: session.userId },
      data,
    });
    return NextResponse.json({ user });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
