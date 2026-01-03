'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { renderResumePdf } from '@/lib/export/pdf';
import { renderResumeDocx } from '@/lib/export/docx';
import { buildZip } from '@/lib/export/zip';
import { saveFile } from '@/lib/storage';
import { assertCanExport } from '@/lib/entitlements';
import { buildResumeFilename } from '@/lib/filename';

export async function exportBatchZip(batchId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  await assertCanExport(session.user.id, 'zip');

  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      resumes: {
        include: {
          jobDescription: true,
          versions: { orderBy: { version: 'desc' }, take: 1 },
          user: true
        }
      }
    }
  });

  if (!batch || batch.userId !== session.user.id) throw new Error('Not found');

  const profile = await prisma.masterProfile.findUnique({
    where: { userId: session.user.id }
  });
  if (!profile) throw new Error('Missing profile');

  const files: { filename: string; buffer: Buffer }[] = [];

  for (const resume of batch.resumes) {
    const content = resume.versions[0]?.contentJson as any;
    if (!content) continue;
    const date = new Date().toISOString().split('T')[0];
    const filenameBase = buildResumeFilename({
      fullName: resume.user.name,
      company: resume.jobDescription.company,
      role: resume.jobDescription.role,
      date
    });

    const pdfBuffer = await renderResumePdf({ profile, content });
    const docxBuffer = await renderResumeDocx({ profile, content });
    files.push({ filename: `${filenameBase}.pdf`, buffer: pdfBuffer });
    files.push({ filename: `${filenameBase}.docx`, buffer: docxBuffer });
  }

  const zipBuffer = await buildZip(files);
  const url = await saveFile({
    buffer: zipBuffer,
    filename: `HireStudio_${batch.id}.zip`,
    contentType: 'application/zip'
  });

  return url;
}
