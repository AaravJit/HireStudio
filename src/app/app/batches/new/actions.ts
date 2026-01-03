'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { extractKeywords } from '@/lib/ats';
import { batchSchema } from '@/lib/validators';
import { redirect } from 'next/navigation';

function parseBulk(text: string) {
  const entries = text
    .split('\n---')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return entries.map((entry) => ({
    text: entry
  }));
}

export async function createBatch(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title')?.toString() || 'New Batch';
  const company = formData.get('company')?.toString() || undefined;
  const role = formData.get('role')?.toString() || undefined;
  const location = formData.get('location')?.toString() || undefined;
  const text = formData.get('text')?.toString() || '';
  const bulk = formData.get('bulk')?.toString() || '';

  const jobDescriptions = bulk
    ? parseBulk(bulk).map((entry) => ({
        company,
        role,
        location,
        text: entry.text
      }))
    : [
        {
          company,
          role,
          location,
          text
        }
      ];

  const parsed = batchSchema.parse({
    title,
    jobDescriptions
  });

  const batch = await prisma.batch.create({
    data: {
      userId: session.user.id,
      title: parsed.title,
      jobDescriptions: {
        create: parsed.jobDescriptions.map((jd) => ({
          ...jd,
          keywords: extractKeywords(jd.text),
          userId: session.user.id
        }))
      }
    }
  });

  redirect(`/app/batches/${batch.id}`);
}
