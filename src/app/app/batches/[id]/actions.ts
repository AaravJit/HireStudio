'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db';
import { assertCanGenerate } from '@/lib/entitlements';

export async function queueGeneration(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const jobDescriptionId = formData.get('jobDescriptionId')?.toString();
  const templateStyle = formData.get('templateStyle')?.toString() || 'Modern';
  if (!jobDescriptionId) {
    throw new Error('Missing job description');
  }

  await assertCanGenerate(session.user.id);

  const jd = await prisma.jobDescription.findUnique({
    where: { id: jobDescriptionId }
  });
  if (!jd || jd.userId !== session.user.id) {
    throw new Error('Job description not found');
  }

  await prisma.generationJob.create({
    data: {
      userId: session.user.id,
      jobDescriptionId,
      payload: { templateStyle }
    }
  });
}
