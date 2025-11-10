import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { listCourses, softDeleteCourse } from '@/lib/actions/course';
import type { Course } from '@prisma/client';

function formatDate(value: Date | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(value);
}

async function deleteCourse(formData: FormData) {
  'use server';

  const id = formData.get('id');
  if (typeof id !== 'string') {
    return;
  }

  await softDeleteCourse(id);
}

export default async function CoursesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const courses = await listCourses();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Courses &amp; Certifications</h2>
            <p className="text-sm text-muted-foreground">
              Track the courses and certifications that reinforce your expertise.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/courses/new">Add Course</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left">
                    <th className="h-12 px-4 font-medium">Title</th>
                    <th className="h-12 px-4 font-medium">Provider</th>
                    <th className="h-12 px-4 font-medium">Issued On</th>
                    <th className="h-12 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length === 0 && (
                    <tr>
                      <td className="p-6 text-center text-muted-foreground" colSpan={4}>
                        No courses yet. Record your first course to highlight continued learning.
                      </td>
                    </tr>
                  )}
                  {courses.map((course: Course) => (
                    <tr key={course.id} className="border-t">
                      <td className="p-4 align-middle font-medium">{course.titleEn}</td>
                      <td className="p-4 align-middle text-muted-foreground">{course.providerEn ?? '—'}</td>
                      <td className="p-4 align-middle text-muted-foreground">{formatDate(course.issuedOn)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center justify-end gap-2">
                          {course.certificateUrl && (
                            <Button asChild variant="ghost" size="sm">
                              <a href={course.certificateUrl} target="_blank" rel="noreferrer">
                                Certificate
                              </a>
                            </Button>
                          )}
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/courses/${course.id}/edit`}>Edit</Link>
                          </Button>
                          <form action={deleteCourse}>
                            <input type="hidden" name="id" value={course.id} />
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
