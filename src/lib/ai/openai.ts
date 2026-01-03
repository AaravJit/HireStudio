import OpenAI from 'openai';
import { resumeContentSchema, type ResumeContent } from './types';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTailoredResume(params: {
  masterProfile: string;
  jobDescription: string;
  keywords: string[];
}): Promise<ResumeContent> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const systemPrompt = `You are an ATS-safe resume optimizer. Follow rules:
- Never fabricate companies, dates, or degrees.
- Only rephrase/re-rank provided experiences.
- Use simple headings and bullet points.
- If missing info, mark "needs info".
Return JSON only.`;

  const userPrompt = `MASTER PROFILE:\n${params.masterProfile}\n\nJOB DESCRIPTION:\n${params.jobDescription}\n\nKEYWORDS:${params.keywords.join(', ')}\n\nReturn JSON with fields: summary, experience (id?, bullets), projects (id?, bullets), skills {core, secondary}, keywords, atsWarnings, matchScore.`;

  const response = await client.responses.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  const outputText = response.output_text?.trim();
  if (!outputText) {
    throw new Error('No response from AI provider');
  }

  const parsed = JSON.parse(outputText) as ResumeContent;
  return resumeContentSchema.parse(parsed);
}
