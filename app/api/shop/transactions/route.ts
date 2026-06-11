import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ transactions });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
