import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          HireStudio
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/pricing">Pricing</Link>
          <Link href="/auth">Sign in</Link>
          <Link href="/app">
            <Button size="sm">Go to app</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
