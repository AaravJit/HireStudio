'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { exportBatchZip } from '@/app/app/batches/[id]/export/actions';

export function BatchExport({ batchId }: { batchId: string }) {
  const [pending, startTransition] = useTransition();
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleExport() {
    setError(null);
    startTransition(async () => {
      try {
        const url = await exportBatchZip(batchId);
        setLink(url);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleExport} disabled={pending}>
        Export ZIP bundle
      </Button>
      {link ? (
        <a href={link} className="text-sm text-primary underline">
          Download ZIP
        </a>
      ) : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
