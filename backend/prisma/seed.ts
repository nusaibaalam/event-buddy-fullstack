import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // admin
  const adminEmail = 'admin@eventbuddy.dev';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      role: 'ADMIN',
      password: await bcrypt.hash('Admin123!', 10),
    },
  });

  // user
  const userEmail = 'user@eventbuddy.dev';
  await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      name: 'User',
      email: userEmail,
      role: 'USER',
      password: await bcrypt.hash('User123!', 10),
    },
  });

  // events
  const now = new Date();
  const future = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // +30 days
  const past = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30); // -30 days

  await prisma.event.createMany({
    data: [
      {
        title: 'Tech Conference 2026',
        description: 'Next-gen tech.',
        location: 'San Francisco, CA',
        date: future,
        capacity: 120,
        imageUrl: 'https://picsum.photos/1200/600?1',
        tags: ['Tech', 'AI', 'Conference'] as any,
      },
      {
        title: 'Design Meetup 2025',
        description: 'UX, UI, and product.',
        location: 'Dhaka',
        date: past,
        capacity: 80,
        imageUrl: 'https://picsum.photos/1200/600?2',
        tags: ['Design', 'Meetup'] as any,
      },
    ],
  });

  console.log('Seed complete. Admin:', adminEmail, 'pw: Admin123!');
}
main().finally(() => prisma.$disconnect());
