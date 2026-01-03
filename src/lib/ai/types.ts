import { z } from 'zod';

export const resumeContentSchema = z.object({
  summary: z.string(),
  experience: z.array(
    z.object({
      id: z.string().optional(),
      bullets: z.array(z.string())
    })
  ),
  projects: z.array(
    z.object({
      id: z.string().optional(),
      bullets: z.array(z.string())
    })
  ),
  skills: z.object({
    core: z.array(z.string()),
    secondary: z.array(z.string())
  }),
  keywords: z.array(z.string()),
  atsWarnings: z.array(z.string()),
  matchScore: z.number().min(0).max(100)
});

export type ResumeContent = z.infer<typeof resumeContentSchema>;
