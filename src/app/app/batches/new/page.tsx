import { createBatch } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function NewBatchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Batch</h1>
        <p className="text-sm text-muted-foreground">
          Paste one or more job descriptions to generate tailored resumes.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job intake</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createBatch} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Batch title</label>
              <Input name="title" placeholder="Product Design Roles" required />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input name="company" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Input name="role" placeholder="Product Designer" />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input name="location" placeholder="Remote" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Job description</label>
              <Textarea
                name="text"
                placeholder="Paste a single job description (min 100 chars)"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bulk mode</label>
              <Textarea
                name="bulk"
                placeholder="Paste multiple job descriptions separated by ---"
              />
            </div>
            <Button type="submit">Create batch</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
