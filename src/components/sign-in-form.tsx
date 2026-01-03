'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleEmailSignIn(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const result = await signIn('email', {
      email,
      redirect: false,
      callbackUrl: '/app'
    });
    setLoading(false);
    if (result?.ok) {
      setMessage('Check your email for a magic link.');
    } else {
      setMessage('Unable to send magic link. Please try again.');
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleEmailSignIn} className="space-y-3">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending...' : 'Send magic link'}
        </Button>
      </form>
      {googleEnabled ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/app' })}
        >
          Continue with Google
        </Button>
      ) : null}
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}
