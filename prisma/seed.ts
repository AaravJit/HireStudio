import { prisma } from '@/lib/db';

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@hirestudio.ai' },
    update: {},
    create: {
      email: 'demo@hirestudio.ai',
      name: 'Demo User'
    }
  });

  await prisma.masterProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      headline: 'Senior Product Manager',
      summary: 'Product leader with experience in SaaS and marketplaces.',
      rawText: 'Managed cross-functional teams, shipped B2B platforms, and scaled growth.'
    }
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
