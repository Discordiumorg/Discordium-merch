const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const bcrypt = require('bcryptjs');

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const demoHash = await bcrypt.hash('demo123', 12);
  const adminHash = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: 'demo@aura.app' },
    update: {},
    create: {
      email: 'demo@aura.app',
      name: 'Demo User',
      passwordHash: demoHash,
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

  await prisma.user.upsert({
    where: { email: 'admin@aura.app' },
    update: {},
    create: {
      email: 'admin@aura.app',
      name: 'Admin',
      passwordHash: adminHash,
      age: 30,
      gender: 'male',
      verified: true,
      isAdmin: true,
      coins: 9999,
      diamonds: 9999,
      boosts: 99,
      superLikes: 99,
    },
  });

  console.log('Seed complete: demo@aura.app / demo123, admin@aura.app / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
