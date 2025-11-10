import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { listProjects, softDeleteProject } from '@/lib/actions/projects';
import type { Project } from '@prisma/client';

function formatDate(value: Date | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(value);
}

async function deleteProject(formData: FormData) {
  'use server';

  const id = formData.get('id');
  if (typeof id !== 'string') {
    return;
  }

  await softDeleteProject(id);
}

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const projects = await listProjects();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Projects</h2>
            <p className="text-sm text-muted-foreground">
              Manage the projects that appear on your public portfolio.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/projects/new">Create Project</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left">
                    <th className="h-12 px-4 font-medium">Title</th>
                    <th className="h-12 px-4 font-medium">Status</th>
                    <th className="h-12 px-4 font-medium">Featured</th>
                    <th className="h-12 px-4 font-medium">Updated</th>
                    <th className="h-12 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 && (
                    <tr>
                      <td className="p-6 text-center text-muted-foreground" colSpan={5}>
                        No projects yet. Create your first project to showcase your work.
                      </td>
                    </tr>
                  )}
                  {projects.map((project: Project) => (
                    <tr key={project.id} className="border-t">
                      <td className="p-4 align-middle font-medium">{project.titleEn}</td>
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                            project.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        {project.featured ? (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">{formatDate(project.updatedAt)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/en/projects/${project.slugEn}`} target="_blank" rel="noreferrer">
                              View
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
                          </Button>
                          <form action={deleteProject}>
                            <input type="hidden" name="id" value={project.id} />
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
