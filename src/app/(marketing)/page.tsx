import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MarketingPage() {
  return (
    <div>
      <SiteHeader />
      <main className="container py-16">
        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Built for job seekers
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Turn one master profile into tailored, ATS-safe resumes in minutes.
            </h1>
            <p className="mt-4 text-muted-foreground">
              HireStudio generates job-specific resumes, highlights missing
              keywords, and keeps every version organized so you can ship
              applications faster.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/auth">
                <Button>Start free</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline">See pricing</Button>
              </Link>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>What you get</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Master Profile</strong>
                <p>Centralize experience, projects, skills, and achievements.</p>
              </div>
              <div>
                <strong className="text-foreground">Tailored outputs</strong>
                <p>Create a resume per job description with match scoring.</p>
              </div>
              <div>
                <strong className="text-foreground">Exports</strong>
                <p>Download PDF, DOCX, or ZIP bundles in the right format.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
