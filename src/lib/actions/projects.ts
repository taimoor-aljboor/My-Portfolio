import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { type ProjectFormValues, projectSchema } from '@/lib/validations/project';
import { z } from 'zod';

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 200);
}

export async function listProjects() {
  return prisma.project.findMany({
    where: { deletedAt: null },
    orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getProject(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function createProject(data: ProjectFormValues) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  // validate
  const parsed = projectSchema.parse(data as any);

  const slugEn = parsed.titleEn ? slugify(parsed.titleEn) : undefined;
  const slugAr = parsed.titleAr ? slugify(parsed.titleAr) : undefined;

  return prisma.project.create({
    data: {
      titleEn: parsed.titleEn,
      titleAr: parsed.titleAr || '',
      shortDescEn: parsed.descriptionEn || '',
      shortDescAr: parsed.descriptionAr || '',
      longDescEn: parsed.descriptionEn || '',
      longDescAr: parsed.descriptionAr || '',
      slugEn: slugEn || parsed.titleEn,
      slugAr: slugAr || parsed.titleAr || parsed.titleEn,
      techStack: parsed.techs || [],
      demoUrl: parsed.url || null,
      repoUrl: parsed.repoUrl || null,
      featured: parsed.featured || false,
      displayOrder: 0,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });
}

export async function updateProject(id: string, data: Partial<ProjectFormValues>) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  // allow partial updates; only validate fields that exist
  const safeData: any = {};
  if (data.titleEn) safeData.titleEn = data.titleEn;
  if (data.titleAr) safeData.titleAr = data.titleAr;
  if (data.descriptionEn) {
    safeData.shortDescEn = data.descriptionEn;
    safeData.longDescEn = data.descriptionEn;
  }
  if (data.descriptionAr) {
    safeData.shortDescAr = data.descriptionAr;
    safeData.longDescAr = data.descriptionAr;
  }
  if (data.url) safeData.demoUrl = data.url;
  if (data.repoUrl) safeData.repoUrl = data.repoUrl;
  if (data.techs) safeData.techStack = data.techs;
  if (typeof data.featured === 'boolean') safeData.featured = data.featured;
  if (data.imageUrl) {
    // create a MediaAsset or store URL in images? For now set a placeholder
  }

  safeData.updatedBy = session.user.email;

  return prisma.project.update({ where: { id }, data: safeData });
}

export async function softDeleteProject(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  return prisma.project.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: session.user.email } });
}
