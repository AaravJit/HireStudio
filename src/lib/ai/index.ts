import type { ResumeContent } from './types';
import { generateTailoredResume } from './openai';

export interface AIProvider {
  generateTailoredResume: (params: {
    masterProfile: string;
    jobDescription: string;
    keywords: string[];
  }) => Promise<ResumeContent>;
}

export const aiProvider: AIProvider = {
  generateTailoredResume
};
