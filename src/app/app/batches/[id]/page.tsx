import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { queueGeneration } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BatchExport } from '@/components/batch-export';

export default async function BatchDetailPage({
  params
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const batch = await prisma.batch.findUnique({
    where: { id: params.id },
    include: {
      jobDescriptions: true,
      resumes: true
    }
  });

  if (!batch || batch.userId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{batch.title}</h1>
          <p className="text-sm text-muted-foreground">
            {batch.jobDescriptions.length} job description(s)
          </p>
        </div>
        <BatchExport batchId={batch.id} />
      </div>
      <div className="space-y-4">
        {batch.jobDescriptions.map((jd) => (
          <Card key={jd.id}>
            <CardHeader>
              <CardTitle>
                {jd.role ?? 'Role'} @ {jd.company ?? 'Company'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{jd.text}</p>
              <form action={queueGeneration} className="flex flex-wrap items-center gap-3">
                <input type="hidden" name="jobDescriptionId" value={jd.id} />
                <select
                  name="templateStyle"
                  className="h-10 rounded-md border border-border bg-white px-3 text-sm"
                  defaultValue="Modern"
                >
                  <option>Modern</option>
                  <option>Classic</option>
                  <option>Minimal</option>
                </select>
                <Button type="submit">Generate</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Generated resumes</h2>
        {batch.resumes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No resumes yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {batch.resumes.map((resume) => (
              <li key={resume.id}>
                <a href={`/app/resumes/${resume.id}/edit`}>
                  Resume {resume.templateStyle} - {resume.status}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
