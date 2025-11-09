import Link from 'next/link';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function AdminProjectsPage() {
  // Placeholder list - replace with server data fetch
  const projects: Array<{ id: string; title: string }> = [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <Link href="/admin/projects/new">
          <Button>Create Project</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p>No projects yet. Use the Create button to add one.</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <span>{p.title}</span>
                  <div className="space-x-2">
                    <Link href={`/admin/projects/${p.id}`}>Edit</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
