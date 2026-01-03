'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db';
import { renderResumePdf } from '@/lib/export/pdf';
import { renderResumeDocx } from '@/lib/export/docx';
import { saveFile } from '@/lib/storage';
import { assertCanExport } from '@/lib/entitlements';
import { buildResumeFilename } from '@/lib/filename';

export async function saveVersion(resumeId: string, contentJson: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  const resume = await prisma.tailoredResume.findUnique({
    where: { id: resumeId },
    include: { versions: true }
  });

  if (!resume || resume.userId !== session.user.id) throw new Error('Not found');

  await prisma.tailoredResumeVersion.create({
    data: {
      resumeId,
      version: resume.versions.length + 1,
      contentJson: JSON.parse(contentJson)
    }
  });
}

export async function exportResume(resumeId: string, type: 'pdf' | 'docx') {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  await assertCanExport(session.user.id, type);

  const resume = await prisma.tailoredResume.findUnique({
    where: { id: resumeId },
    include: {
      jobDescription: true,
      versions: { orderBy: { version: 'desc' }, take: 1 },
      user: true
    }
  });

  if (!resume || resume.userId !== session.user.id) throw new Error('Not found');

  const profile = await prisma.masterProfile.findUnique({
    where: { userId: session.user.id }
  });
  if (!profile) throw new Error('Missing profile');

  const content = resume.versions[0]?.contentJson as any;
  const filenameBase = buildResumeFilename({
    fullName: resume.user.name,
    company: resume.jobDescription.company,
    role: resume.jobDescription.role,
    date: new Date().toISOString().split('T')[0]
  });

  const buffer =
    type === 'pdf'
      ? await renderResumePdf({ profile, content })
      : await renderResumeDocx({ profile, content });

  const url = await saveFile({
    buffer,
    filename: `${filenameBase}.${type}`,
    contentType:
      type === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });

  await prisma.exportArtifact.create({
    data: {
      resumeId: resume.id,
      type,
      url
    }
  });

  return url;
}
