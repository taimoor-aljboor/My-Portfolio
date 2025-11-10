import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseForm } from '@/components/course-form';
import { createCourse } from '@/lib/actions/course';
import type { CourseFormValues } from '@/lib/validations/course';

export default async function NewCoursePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  async function handleCreate(data: CourseFormValues) {
    'use server';

    await createCourse(data);
    redirect('/admin/courses');
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Add Course or Certification</CardTitle>
          <CardDescription>Document new learning milestones and attach certificates.</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm onSubmit={handleCreate} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
