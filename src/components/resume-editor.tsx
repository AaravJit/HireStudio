'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { saveVersion } from '@/app/app/resumes/[id]/edit/actions';

export function ResumeEditor({
  resumeId,
  initialContent
}: {
  resumeId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      try {
        await saveVersion(resumeId, content);
        setMessage('Saved new version.');
      } catch (err) {
        setMessage((err as Error).message);
      }
    });
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-[320px] font-mono text-xs"
      />
      <Button onClick={handleSave} disabled={pending}>
        {pending ? 'Saving...' : 'Save version'}
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
