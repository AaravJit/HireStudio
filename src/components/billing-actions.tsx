'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function BillingActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/stripe/checkout', { method: 'POST' });
    const data = await res.json();
    setLoading(false);
    if (data?.url) {
      window.location.href = data.url;
    } else {
      setError(data?.error ?? 'Unable to start checkout');
    }
  }

  async function handlePortal() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();
    setLoading(false);
    if (data?.url) {
      window.location.href = data.url;
    } else {
      setError(data?.error ?? 'Unable to open portal');
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleCheckout} disabled={loading}>
          Upgrade to Pro
        </Button>
        <Button variant="outline" onClick={handlePortal} disabled={loading}>
          Manage subscription
        </Button>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
