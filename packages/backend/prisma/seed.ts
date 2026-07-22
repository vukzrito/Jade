import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-salon' },
    update: {},
    create: {
      name: 'Demo Salon',
      slug: 'demo-salon',
      email: 'hello@demosalon.com',
      phone: '+1234567890',
      timezone: 'America/New_York',
    },
  });

  const passwordHash = await bcrypt.hash('password123', 12);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@demosalon.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'owner@demosalon.com',
      passwordHash,
      firstName: 'Jane',
      lastName: 'Owner',
      role: UserRole.OWNER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff@demosalon.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'staff@demosalon.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Staff',
      role: UserRole.STAFF,
    },
  });

  const haircut = await prisma.category.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Haircuts' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Haircuts', sortOrder: 1 },
  });

  await prisma.category.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Styling' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Styling', sortOrder: 2 },
  });

  await prisma.service.upsert({
    where: { id: 'demo-haircut' },
    update: {},
    create: {
      id: 'demo-haircut',
      tenantId: tenant.id,
      categoryId: haircut.id,
      name: 'Men\'s Haircut',
      duration: 30,
      price: 35,
    },
  });

  await prisma.service.upsert({
    where: { id: 'demo-blowdry' },
    update: {},
    create: {
      id: 'demo-blowdry',
      tenantId: tenant.id,
      categoryId: haircut.id,
      name: 'Blow Dry',
      duration: 45,
      price: 50,
    },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
