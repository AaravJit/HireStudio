import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function AppHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-border bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/app" className="text-lg font-semibold">
          HireStudio
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/app/profile">Master Profile</Link>
          <Link href="/app/batches/new">New Batch</Link>
          <Link href="/app/billing">Billing</Link>
          <span className="text-xs text-muted-foreground">
            {session?.user?.email}
          </span>
        </nav>
      </div>
    </header>
  );
}
