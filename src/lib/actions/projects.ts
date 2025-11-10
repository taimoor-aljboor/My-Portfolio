import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { type ProjectFormValues, projectSchema } from '@/lib/validations/project';

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 200);
}

function revalidateProjectPaths() {
  revalidatePath('/admin');
  revalidatePath('/admin/projects');
  revalidatePath('/en');
  revalidatePath('/ar');
  revalidatePath('/en/projects');
  revalidatePath('/ar/projects');
}

export async function listProjects() {
  return prisma.project.findMany({
    where: { deletedAt: null },
    orderBy: [
      { featured: 'desc' },
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
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

  const project = await prisma.project.create({
    data: {
      titleEn: parsed.titleEn,
      titleAr: parsed.titleAr || '',
      shortDescEn: parsed.descriptionEn || '',
      shortDescAr: parsed.descriptionAr || '',
      longDescEn: parsed.descriptionEn || '',
      longDescAr: parsed.descriptionAr || '',
      slugEn: slugEn || parsed.titleEn,
      slugAr: slugAr || parsed.titleAr || parsed.titleEn,
      techStack: parsed.techs?.filter(Boolean) || [],
      demoUrl: parsed.url ? parsed.url : null,
      repoUrl: parsed.repoUrl ? parsed.repoUrl : null,
      featured: parsed.featured || false,
      displayOrder: 0,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });

  revalidateProjectPaths();

  return project;
}

export async function updateProject(id: string, data: Partial<ProjectFormValues>) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  // allow partial updates; only validate fields that exist
  const safeData: any = {};
  if (typeof data.titleEn !== 'undefined') {
    safeData.titleEn = data.titleEn;
    safeData.slugEn = slugify(data.titleEn);
  }
  if (typeof data.titleAr !== 'undefined') {
    safeData.titleAr = data.titleAr || '';
    if (data.titleAr) {
      safeData.slugAr = slugify(data.titleAr);
    }
  }
  if (typeof data.descriptionEn !== 'undefined') {
    safeData.shortDescEn = data.descriptionEn || '';
    safeData.longDescEn = data.descriptionEn || '';
  }
  if (typeof data.descriptionAr !== 'undefined') {
    safeData.shortDescAr = data.descriptionAr || '';
    safeData.longDescAr = data.descriptionAr || '';
  }
  if (typeof data.url !== 'undefined') safeData.demoUrl = data.url || null;
  if (typeof data.repoUrl !== 'undefined') safeData.repoUrl = data.repoUrl || null;
  if (typeof data.techs !== 'undefined') safeData.techStack = data.techs?.filter(Boolean) || [];
  if (typeof data.featured === 'boolean') safeData.featured = data.featured;
  if (typeof data.imageUrl !== 'undefined') {
    // create a MediaAsset or store URL in images? For now set a placeholder
  }

  safeData.updatedBy = session.user.email;

  const project = await prisma.project.update({ where: { id }, data: safeData });

  revalidateProjectPaths();

  return project;
}

export async function softDeleteProject(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const project = await prisma.project.update({
    where: { id },
    data: { deletedAt: new Date(), updatedBy: session.user.email },
  });

  revalidateProjectPaths();

  return project;
}
