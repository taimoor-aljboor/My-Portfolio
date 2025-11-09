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
      titleAr: parsed.titleAr || '',
      descriptionEn: parsed.descriptionEn || '',
      descriptionAr: parsed.descriptionAr || '',
      issuedByEn: parsed.issuedByEn || '',
      issuedByAr: parsed.issuedByAr || '',
      achievedOn: parsed.achievedOn,
      linkUrl: parsed.linkUrl || null,
      logoUrl: parsed.logoUrl || null,
      displayOrder: parsed.displayOrder || 0,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });
}

export async function updateAchievement(id: string, data: Partial<AchievementFormValues>) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const safeData: any = {};
  if (data.titleEn) safeData.titleEn = data.titleEn;
  if (data.titleAr) safeData.titleAr = data.titleAr;
  if (data.descriptionEn) safeData.descriptionEn = data.descriptionEn;
  if (data.descriptionAr) safeData.descriptionAr = data.descriptionAr;
  if (data.issuedByEn) safeData.issuedByEn = data.issuedByEn;
  if (data.issuedByAr) safeData.issuedByAr = data.issuedByAr;
  if (data.achievedOn) safeData.achievedOn = data.achievedOn as any;
  if (data.linkUrl) safeData.linkUrl = data.linkUrl;
  if (data.logoUrl) safeData.logoUrl = data.logoUrl;
  if (typeof data.displayOrder !== 'undefined') safeData.displayOrder = data.displayOrder;

  safeData.updatedBy = session.user.email;

  return prisma.achievement.update({ where: { id }, data: safeData });
}

export async function softDeleteAchievement(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  return prisma.achievement.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: session.user.email } });
}
