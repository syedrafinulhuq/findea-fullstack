import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await argon2.hash('Admin@12345');
  await prisma.user.upsert({
    where: { email: 'admin@fidea.local' },
    update: {},
    create: { email: 'admin@fidea.local', passwordHash: adminPasswordHash, role: Role.ADMIN, firstName: 'Fidea', lastName: 'Admin' },
  });

  const category = await prisma.category.upsert({
    where: { slug: 'featured' },
    update: {},
    create: { name: 'Featured', slug: 'featured' },
  });

  await prisma.product.upsert({
    where: { slug: 'demo-product' },
    update: {},
    create: { name: 'Demo Product', slug: 'demo-product', description: 'Starter product for frontend integration.', price: 1200, stock: 25, categoryId: category.id },
  });
}

main().finally(() => prisma.$disconnect());
