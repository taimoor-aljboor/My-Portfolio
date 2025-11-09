import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { courseSchema, type CourseFormValues } from '@/lib/validations/course';

export async function listCourses() {
  return prisma.course.findMany({ where: { deletedAt: null }, orderBy: { issuedOn: 'desc' } });
}

export async function getCourse(id: string) {
  return prisma.course.findUnique({ where: { id } });
}

export async function createCourse(data: CourseFormValues) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const parsed = courseSchema.parse(data as any);

  return prisma.course.create({
    data: {
      titleEn: parsed.titleEn,
      titleAr: parsed.titleAr || '',
      providerEn: parsed.providerEn || '',
      providerAr: parsed.providerAr || '',
      issuedOn: parsed.issuedOn,
      certificateUrl: parsed.certificateUrl || null,
      notesEn: parsed.notesEn || null,
      notesAr: parsed.notesAr || null,
      displayOrder: parsed.displayOrder || 0,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });
}

export async function updateCourse(id: string, data: Partial<CourseFormValues>) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const safeData: any = {};
  if (data.titleEn) safeData.titleEn = data.titleEn;
  if (data.titleAr) safeData.titleAr = data.titleAr;
  if (data.providerEn) safeData.providerEn = data.providerEn;
  if (data.providerAr) safeData.providerAr = data.providerAr;
  if (data.issuedOn) safeData.issuedOn = data.issuedOn as any;
  if (data.certificateUrl) safeData.certificateUrl = data.certificateUrl;
  if (data.notesEn) safeData.notesEn = data.notesEn;
  if (data.notesAr) safeData.notesAr = data.notesAr;
  if (typeof data.displayOrder !== 'undefined') safeData.displayOrder = data.displayOrder;

  safeData.updatedBy = session.user.email;

  return prisma.course.update({ where: { id }, data: safeData });
}

export async function softDeleteCourse(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  return prisma.course.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: session.user.email } });
}
