export function buildResumeFilename({
  fullName,
  company,
  role,
  date
}: {
  fullName?: string | null;
  company?: string | null;
  role?: string | null;
  date: string;
}) {
  const lastName = fullName?.split(' ').slice(-1)[0] ?? 'Candidate';
  const safe = (value: string) => value.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
  return `${safe(lastName)}_${safe(company ?? 'Company')}_${safe(role ?? 'Role')}_${date}`;
}
