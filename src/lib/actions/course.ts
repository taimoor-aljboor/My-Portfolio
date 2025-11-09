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
      titleAr: parsed.titleAr || null,
      providerEn: parsed.providerEn || null,
      providerAr: parsed.providerAr || null,
      issuedOn: parsed.issuedOn,
      certificateUrl: parsed.certificateUrl || null,
      notesEn: parsed.notesEn || null,
      notesAr: parsed.notesAr || null,
      displayOrder: parsed.displayOrder ?? 0,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });
}

export async function updateCourse(id: string, data: Partial<CourseFormValues>) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const safeData: any = {};
  if (typeof data.titleEn !== 'undefined') safeData.titleEn = data.titleEn;
  if (typeof data.titleAr !== 'undefined') safeData.titleAr = data.titleAr || null;
  if (typeof data.providerEn !== 'undefined') safeData.providerEn = data.providerEn || null;
  if (typeof data.providerAr !== 'undefined') safeData.providerAr = data.providerAr || null;
  if (typeof data.issuedOn !== 'undefined') safeData.issuedOn = data.issuedOn as any;
  if (typeof data.certificateUrl !== 'undefined') safeData.certificateUrl = data.certificateUrl || null;
  if (typeof data.notesEn !== 'undefined') safeData.notesEn = data.notesEn || null;
  if (typeof data.notesAr !== 'undefined') safeData.notesAr = data.notesAr || null;
  if (typeof data.displayOrder !== 'undefined') safeData.displayOrder = data.displayOrder;

  safeData.updatedBy = session.user.email;

  return prisma.course.update({ where: { id }, data: safeData });
}

export async function softDeleteCourse(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  return prisma.course.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: session.user.email } });
}
