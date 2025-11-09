import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { educationSchema, type EducationFormValues } from '@/lib/validations/education';

export async function listEducation() {
  return prisma.education.findMany({ where: { deletedAt: null }, orderBy: { displayOrder: 'asc' } });
}

export async function getEducation(id: string) {
  return prisma.education.findUnique({ where: { id } });
}

export async function createEducation(data: EducationFormValues) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const parsed = educationSchema.parse(data as any);

  return prisma.education.create({
    data: {
      institutionEn: parsed.institutionEn,
      institutionAr: parsed.institutionAr || '',
      degreeEn: parsed.degreeEn || '',
      degreeAr: parsed.degreeAr || '',
      fieldEn: parsed.fieldEn || '',
      fieldAr: parsed.fieldAr || '',
      startDate: parsed.startDate,
      endDate: parsed.endDate || null,
      grade: parsed.grade || null,
      notesEn: parsed.notesEn || null,
      notesAr: parsed.notesAr || null,
      displayOrder: parsed.displayOrder || 0,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });
}

export async function updateEducation(id: string, data: Partial<EducationFormValues>) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const safeData: any = {};
  if (data.institutionEn) safeData.institutionEn = data.institutionEn;
  if (data.institutionAr) safeData.institutionAr = data.institutionAr;
  if (data.degreeEn) safeData.degreeEn = data.degreeEn;
  if (data.degreeAr) safeData.degreeAr = data.degreeAr;
  if (data.fieldEn) safeData.fieldEn = data.fieldEn;
  if (data.fieldAr) safeData.fieldAr = data.fieldAr;
  if (data.startDate) safeData.startDate = data.startDate as any;
  if (typeof data.endDate !== 'undefined') safeData.endDate = data.endDate as any;
  if (data.grade) safeData.grade = data.grade;
  if (data.notesEn) safeData.notesEn = data.notesEn;
  if (data.notesAr) safeData.notesAr = data.notesAr;
  if (typeof data.displayOrder !== 'undefined') safeData.displayOrder = data.displayOrder;

  safeData.updatedBy = session.user.email;

  return prisma.education.update({ where: { id }, data: safeData });
}

export async function softDeleteEducation(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  return prisma.education.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: session.user.email } });
}
