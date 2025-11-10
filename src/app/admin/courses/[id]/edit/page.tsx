import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseForm } from '@/components/course-form';
import { getCourse, updateCourse } from '@/lib/actions/course';
import type { CourseFormValues } from '@/lib/validations/course';
import type { Course } from '@prisma/client';

function mapCourseToFormValues(course: Course): CourseFormValues {
  return {
    titleEn: course.titleEn,
    titleAr: course.titleAr ?? '',
    providerEn: course.providerEn ?? '',
    providerAr: course.providerAr ?? '',
    issuedOn: course.issuedOn,
    certificateUrl: course.certificateUrl ?? '',
    notesEn: course.notesEn ?? '',
    notesAr: course.notesAr ?? '',
    displayOrder: course.displayOrder ?? 0,
  };
}

interface EditCoursePageProps {
  params: {
    id: string;
  };
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const course = await getCourse(params.id);

  if (!course || course.deletedAt) {
    notFound();
  }

  const initialValues = mapCourseToFormValues(course);

  async function handleUpdate(data: CourseFormValues) {
    'use server';

    await updateCourse(params.id, data);
    redirect('/admin/courses');
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Edit Course</CardTitle>
          <CardDescription>Update course details, providers, and certificate links.</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm initialData={initialValues} onSubmit={handleUpdate} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
