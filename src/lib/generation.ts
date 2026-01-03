import { prisma } from '@/lib/db';
import { aiProvider } from '@/lib/ai';
import { atsWarnings, matchScore } from '@/lib/ats';
import { formatResumeText } from '@/lib/resume-format';

export async function processGenerationJob(jobId: string) {
  const job = await prisma.generationJob.findUnique({
    where: { id: jobId },
    include: {
      jobDescription: true,
      user: true
    }
  });

  if (!job) return;
  if (job.status !== 'queued') return;

  await prisma.generationJob.update({
    where: { id: jobId },
    data: { status: 'running', progress: 10 }
  });

  try {
    const profile = await prisma.masterProfile.findUnique({
      where: { userId: job.userId }
    });

    if (!profile) {
      await prisma.generationJob.update({
        where: { id: jobId },
        data: { status: 'failed', error: 'Missing master profile' }
      });
      return;
    }

    const content = await aiProvider.generateTailoredResume({
      masterProfile: profile.rawText ?? profile.summary ?? 'No profile text provided',
      jobDescription: job.jobDescription.text,
      keywords: job.jobDescription.keywords
    });

    const resumeText = formatResumeText({ profile, content });
    const score = matchScore({
      jdText: job.jobDescription.text,
      resumeText,
      keywords: job.jobDescription.keywords
    });
    const warnings = atsWarnings(resumeText);

    const resume = await prisma.tailoredResume.create({
      data: {
        userId: job.userId,
        batchId: job.jobDescription.batchId,
        jobDescriptionId: job.jobDescriptionId,
        templateStyle: (job.payload as { templateStyle?: string }).templateStyle ?? 'Modern',
        status: 'ready',
        matchScore: score,
        versions: {
          create: {
            version: 1,
            contentJson: {
              ...content,
              matchScore: score,
              atsWarnings: Array.from(new Set([...content.atsWarnings, ...warnings]))
            }
          }
        }
      }
    });

    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: 'completed', progress: 100 }
    });

    return resume;
  } catch (error) {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: 'failed', error: (error as Error).message }
    });
  }
}
