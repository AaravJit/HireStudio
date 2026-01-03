import { prisma } from '@/lib/db';
import { processGenerationJob } from '@/lib/generation';

async function run() {
  const jobs = await prisma.generationJob.findMany({
    where: { status: 'queued' },
    orderBy: { createdAt: 'asc' },
    take: 10
  });

  for (const job of jobs) {
    await processGenerationJob(job.id);
  }

  await prisma.$disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
