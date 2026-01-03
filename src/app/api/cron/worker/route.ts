import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { processGenerationJob } from '@/lib/generation';

export async function GET(request: Request) {
  const secret = request.headers.get('x-cron-secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobs = await prisma.generationJob.findMany({
    where: { status: 'queued' },
    orderBy: { createdAt: 'asc' },
    take: 5
  });

  for (const job of jobs) {
    await processGenerationJob(job.id);
  }

  return NextResponse.json({ processed: jobs.length });
}
