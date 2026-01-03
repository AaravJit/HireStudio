'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db';
import { masterProfileSchema } from '@/lib/validators';

export async function upsertMasterProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const parsed = masterProfileSchema.parse({
    headline: formData.get('headline')?.toString() || undefined,
    summary: formData.get('summary')?.toString() || undefined,
    location: formData.get('location')?.toString() || undefined,
    rawText: formData.get('rawText')?.toString() || undefined
  });

  await prisma.masterProfile.upsert({
    where: { userId: session.user.id },
    update: parsed,
    create: {
      userId: session.user.id,
      ...parsed
    }
  });
}
