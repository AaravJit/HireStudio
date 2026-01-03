import { SignInForm } from '@/components/sign-in-form';
import { SiteHeader } from '@/components/site-header';

export default function AuthPage() {
  return (
    <div>
      <SiteHeader />
      <main className="container py-16">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold">Sign in to HireStudio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use a magic link or Google OAuth to access your workspace.
          </p>
          <div className="mt-6">
            <SignInForm />
          </div>
        </div>
      </main>
    </div>
  );
}
