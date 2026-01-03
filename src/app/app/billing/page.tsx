import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillingActions } from '@/components/billing-actions';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your HireStudio subscription.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Status: {subscription?.status ?? 'free'}
          </p>
          <BillingActions />
          <Link href="/pricing">
            <Button variant="outline">View pricing</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
