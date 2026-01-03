import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getMonthlyUsage, FREE_MONTHLY_LIMIT, isProUser } from '@/lib/entitlements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [profile, batches, usage, pro] = await Promise.all([
    prisma.masterProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.batch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 3
    }),
    getMonthlyUsage(session.user.id),
    isProUser(session.user.id)
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track your master profile and generation history.
          </p>
        </div>
        <Link href="/app/batches/new">
          <Button>Create Tailored Resumes</Button>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Master Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {profile ? (
              <div>
                <p className="text-foreground font-medium">{profile.headline ?? 'Profile ready'}</p>
                <p className="mt-1">Last updated {profile.updatedAt.toDateString()}</p>
              </div>
            ) : (
              <div>
                <p>No master profile yet.</p>
                <Link href="/app/profile">
                  <Button variant="outline" size="sm" className="mt-3">
                    Create profile
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              {usage} / {pro ? '∞' : FREE_MONTHLY_LIMIT} resumes generated
              this month.
            </p>
            {!pro ? (
              <Link href="/app/billing">
                <Button variant="outline" size="sm" className="mt-3">
                  Upgrade to Pro
                </Button>
              </Link>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Batches</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {batches.length === 0 ? (
              <p>No batches yet.</p>
            ) : (
              <ul className="space-y-2">
                {batches.map((batch) => (
                  <li key={batch.id}>
                    <Link href={`/app/batches/${batch.id}`}>
                      {batch.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
