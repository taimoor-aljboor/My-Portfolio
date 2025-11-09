import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { achievementSchema, type AchievementFormValues } from '@/lib/validations/achievement';

export async function listAchievements() {
  return prisma.achievement.findMany({ where: { deletedAt: null }, orderBy: { achievedOn: 'desc' } });
}

export async function getAchievement(id: string) {
  return prisma.achievement.findUnique({ where: { id } });
}

export async function createAchievement(data: AchievementFormValues) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const parsed = achievementSchema.parse(data as any);

  return prisma.achievement.create({
    data: {
      titleEn: parsed.titleEn,
      titleAr: parsed.titleAr || null,
      descriptionEn: parsed.descriptionEn || null,
      descriptionAr: parsed.descriptionAr || null,
      issuedByEn: parsed.issuedByEn || null,
      issuedByAr: parsed.issuedByAr || null,
      achievedOn: parsed.achievedOn,
      linkUrl: parsed.linkUrl || null,
      logoUrl: parsed.logoUrl || null,
      displayOrder: parsed.displayOrder ?? 0,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });
}

export async function updateAchievement(id: string, data: Partial<AchievementFormValues>) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const safeData: any = {};
  if (typeof data.titleEn !== 'undefined') safeData.titleEn = data.titleEn;
  if (typeof data.titleAr !== 'undefined') safeData.titleAr = data.titleAr || null;
  if (typeof data.descriptionEn !== 'undefined') safeData.descriptionEn = data.descriptionEn || null;
  if (typeof data.descriptionAr !== 'undefined') safeData.descriptionAr = data.descriptionAr || null;
  if (typeof data.issuedByEn !== 'undefined') safeData.issuedByEn = data.issuedByEn || null;
  if (typeof data.issuedByAr !== 'undefined') safeData.issuedByAr = data.issuedByAr || null;
  if (typeof data.achievedOn !== 'undefined') safeData.achievedOn = data.achievedOn as any;
  if (typeof data.linkUrl !== 'undefined') safeData.linkUrl = data.linkUrl || null;
  if (typeof data.logoUrl !== 'undefined') safeData.logoUrl = data.logoUrl || null;
  if (typeof data.displayOrder !== 'undefined') safeData.displayOrder = data.displayOrder;

  safeData.updatedBy = session.user.email;

  return prisma.achievement.update({ where: { id }, data: safeData });
}

export async function softDeleteAchievement(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  return prisma.achievement.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: session.user.email } });
}
