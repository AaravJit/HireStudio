import type { ResumeContent } from '@/lib/ai/types';
import type { MasterProfile } from '@prisma/client';

export function formatResumeText({
  profile,
  content
}: {
  profile: MasterProfile;
  content: ResumeContent;
}) {
  const lines: string[] = [];
  if (profile.headline) lines.push(profile.headline);
  if (profile.summary) lines.push(profile.summary);
  lines.push('Summary');
  lines.push(content.summary);
  lines.push('Experience');
  content.experience.forEach((exp) => {
    exp.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
  });
  lines.push('Projects');
  content.projects.forEach((project) => {
    project.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
  });
  lines.push('Skills');
  lines.push(`Core: ${content.skills.core.join(', ')}`);
  lines.push(`Secondary: ${content.skills.secondary.join(', ')}`);
  return lines.join('\n');
}
