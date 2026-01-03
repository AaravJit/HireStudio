import { describe, it, expect } from 'vitest';
import { extractKeywords, matchScore } from '@/lib/ats';

describe('ATS utilities', () => {
  it('extracts keywords from job description', () => {
    const keywords = extractKeywords('We need a product manager with SaaS and growth experience.');
    expect(keywords).toContain('product');
    expect(keywords).toContain('manager');
  });

  it('calculates match score', () => {
    const score = matchScore({
      jdText: 'Senior product manager with 5+ years experience',
      resumeText: 'Product manager with 6 years experience leading teams',
      keywords: ['product', 'manager', 'experience']
    });
    expect(score).toBeGreaterThan(0);
  });
});
