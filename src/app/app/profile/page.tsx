import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { upsertMasterProfile } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const profile = await prisma.masterProfile.findUnique({
    where: { userId: session.user.id }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Master Profile</h1>
        <p className="text-sm text-muted-foreground">
          Keep a single source of truth for every resume you generate.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile basics</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertMasterProfile} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Headline</label>
              <Input
                name="headline"
                defaultValue={profile?.headline ?? ''}
                placeholder="Senior Product Designer"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                name="location"
                defaultValue={profile?.location ?? ''}
                placeholder="New York, NY"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Summary</label>
              <Textarea
                name="summary"
                defaultValue={profile?.summary ?? ''}
                placeholder="Brief summary of your experience"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Paste resume text</label>
              <Textarea
                name="rawText"
                defaultValue={profile?.rawText ?? ''}
                placeholder="Paste existing resume text to bootstrap"
              />
            </div>
            <Button type="submit">Save profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
