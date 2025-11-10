import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { educationSchema, type EducationFormValues } from '@/lib/validations/education';

export async function listEducation() {
  return prisma.education.findMany({ orderBy: { displayOrder: 'asc' } });
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
      locationEn: parsed.locationEn || '',
      locationAr: parsed.locationAr || '',
      startDate: parsed.startDate,
      endDate: parsed.endDate || null,
      gpa: typeof parsed.gpa === 'number' ? parsed.gpa : null,
      descriptionEn: parsed.descriptionEn || null,
      descriptionAr: parsed.descriptionAr || null,
      displayOrder: parsed.displayOrder || 0,
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
  if (data.locationEn) safeData.locationEn = data.locationEn;
  if (data.locationAr) safeData.locationAr = data.locationAr;
  if (data.startDate) safeData.startDate = data.startDate as any;
  if (typeof data.endDate !== 'undefined') safeData.endDate = data.endDate as any;
  if (typeof data.gpa !== 'undefined') {
    const parsedGpa = Number(data.gpa);
    safeData.gpa = Number.isFinite(parsedGpa) ? parsedGpa : null;
  }
  if (data.descriptionEn) safeData.descriptionEn = data.descriptionEn;
  if (data.descriptionAr) safeData.descriptionAr = data.descriptionAr;
  if (typeof data.displayOrder !== 'undefined') safeData.displayOrder = data.displayOrder;

  return prisma.education.update({ where: { id }, data: safeData });
}

export async function softDeleteEducation(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  await prisma.education.delete({ where: { id } });
}
