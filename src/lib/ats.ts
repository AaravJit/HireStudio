const STOPWORDS = new Set([
  'and',
  'or',
  'the',
  'a',
  'an',
  'to',
  'of',
  'in',
  'for',
  'with',
  'on',
  'at',
  'by',
  'from',
  'is',
  'are',
  'as',
  'be',
  'this',
  'that',
  'will',
  'you',
  'your'
]);

export function extractKeywords(text: string): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));

  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([token]) => token);
}

export function calculateCoverage(keywords: string[], resumeText: string) {
  if (keywords.length === 0) return 0;
  const haystack = resumeText.toLowerCase();
  const hits = keywords.filter((keyword) => haystack.includes(keyword.toLowerCase()));
  return Math.round((hits.length / keywords.length) * 100);
}

export function atsWarnings(resumeText: string) {
  const warnings: string[] = [];
  const summaryLength = resumeText.split('\n').slice(0, 3).join(' ').length;
  if (summaryLength > 500) {
    warnings.push('Summary is longer than 500 characters.');
  }
  const bulletLines = resumeText.split('\n').filter((line) => line.trim().startsWith('-'));
  if (bulletLines.length > 24) {
    warnings.push('Too many bullet points; focus on impact.');
  }
  if (resumeText.toLowerCase().includes('responsible for')) {
    warnings.push('Overuse of "responsible for" detected.');
  }
  if (!resumeText.match(/\d/)) {
    warnings.push('Add metrics to quantify impact.');
  }
  return warnings;
}

export function roleFitScore(jdText: string, resumeText: string) {
  const seniorKeywords = ['senior', 'lead', 'principal', 'manager'];
  const isSeniorRole = seniorKeywords.some((word) => jdText.toLowerCase().includes(word));
  const resumeHasLeadership = ['lead', 'managed', 'mentored'].some((word) =>
    resumeText.toLowerCase().includes(word)
  );
  return isSeniorRole === resumeHasLeadership ? 80 : 60;
}

export function seniorityFitScore(jdText: string, resumeText: string) {
  const yearsMatch = jdText.match(/(\d+)\+?\s+years?/i);
  if (!yearsMatch) return 70;
  const years = Number(yearsMatch[1]);
  const resumeYears = resumeText.match(/(\d+)\+?\s+years?/i);
  if (!resumeYears) return 60;
  return Number(resumeYears[1]) >= years ? 85 : 55;
}

export function matchScore({
  jdText,
  resumeText,
  keywords
}: {
  jdText: string;
  resumeText: string;
  keywords: string[];
}) {
  const coverage = calculateCoverage(keywords, resumeText);
  const roleFit = roleFitScore(jdText, resumeText);
  const seniorityFit = seniorityFitScore(jdText, resumeText);
  return Math.round(0.6 * coverage + 0.2 * roleFit + 0.2 * seniorityFit);
}
