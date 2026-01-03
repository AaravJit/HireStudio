import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db';
import { ResumeEditor } from '@/components/resume-editor';
import { ExportButtons } from '@/components/export-buttons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ResumeEditPage({
  params
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const resume = await prisma.tailoredResume.findUnique({
    where: { id: params.id },
    include: {
      jobDescription: true,
      versions: { orderBy: { version: 'desc' }, take: 1 }
    }
  });

  if (!resume || resume.userId !== session.user.id) {
    return notFound();
  }

  const latest = resume.versions[0];
  const content = (latest?.contentJson ?? {}) as {
    keywords?: string[];
    atsWarnings?: string[];
  };
  const contentJson = latest ? JSON.stringify(latest.contentJson, null, 2) : '{}';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Resume editor</h1>
        <p className="text-sm text-muted-foreground">
          {resume.jobDescription.role ?? 'Role'} @ {resume.jobDescription.company ?? 'Company'}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Editable content (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumeEditor resumeId={resume.id} initialContent={contentJson} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Match score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{resume.matchScore ?? 0}%</p>
              <p className="text-sm text-muted-foreground">ATS coverage score</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ATS check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Keywords</p>
                <p>{content.keywords?.join(', ') || 'No keywords yet.'}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Warnings</p>
                <ul className="list-disc pl-4">
                  {(content.atsWarnings ?? []).length > 0 ? (
                    content.atsWarnings?.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))
                  ) : (
                    <li>No warnings detected.</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <ExportButtons resumeId={resume.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
