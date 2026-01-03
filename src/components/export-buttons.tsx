'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { exportResume } from '@/app/app/resumes/[id]/edit/actions';

export function ExportButtons({ resumeId }: { resumeId: string }) {
  const [pending, startTransition] = useTransition();
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleExport(type: 'pdf' | 'docx') {
    setError(null);
    startTransition(async () => {
      try {
        const url = await exportResume(resumeId, type);
        setLink(url);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleExport('pdf')} disabled={pending}>
          Export PDF
        </Button>
        <Button variant="outline" onClick={() => handleExport('docx')} disabled={pending}>
          Export DOCX
        </Button>
      </div>
      {link ? (
        <a href={link} className="text-sm text-primary underline">
          Download latest export
        </a>
      ) : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
