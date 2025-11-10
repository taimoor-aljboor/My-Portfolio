import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectForm } from '@/components/project-form';
import { createProject } from '@/lib/actions/projects';
import type { ProjectFormValues } from '@/lib/validations/project';

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  async function handleCreate(data: ProjectFormValues) {
    'use server';

    await createProject(data);
    redirect('/admin/projects');
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Add a new project to your portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm onSubmit={handleCreate} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
