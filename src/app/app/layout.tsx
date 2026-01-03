import { AppHeader } from '@/components/app-header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AppHeader />
      <main className="container py-8">{children}</main>
    </div>
  );
}
