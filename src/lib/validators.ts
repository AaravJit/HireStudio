import { z } from 'zod';

export const masterProfileSchema = z.object({
  headline: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  rawText: z.string().optional()
});

export const batchSchema = z.object({
  title: z.string().min(3),
  jobDescriptions: z
    .array(
      z.object({
        company: z.string().optional(),
        role: z.string().optional(),
        location: z.string().optional(),
        text: z.string().min(100)
      })
    )
    .min(1)
});
