import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectForm } from '@/components/project-form';
import { getProject, updateProject } from '@/lib/actions/projects';
import type { ProjectFormValues } from '@/lib/validations/project';
import type { Project } from '@prisma/client';

function mapProjectToFormValues(project: Project): ProjectFormValues {
  return {
    titleEn: project.titleEn,
    titleAr: project.titleAr ?? '',
    descriptionEn: project.longDescEn ?? '',
    descriptionAr: project.longDescAr ?? '',
    url: project.demoUrl ?? '',
    repoUrl: project.repoUrl ?? '',
    techs: project.techStack ?? [],
    featured: project.featured,
    imageUrl: '',
  };
}

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const project = await getProject(params.id);

  if (!project || project.deletedAt) {
    notFound();
  }

  const initialValues = mapProjectToFormValues(project);

  async function handleUpdate(data: ProjectFormValues) {
    'use server';

    await updateProject(params.id, data);
    redirect('/admin/projects');
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update your project details and bilingual content.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm initialData={initialValues} onSubmit={handleUpdate} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
