import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

export type ProjectCategoryFormData = {
  nameEn: string;
  nameAr: string;
  slugEn: string;
  slugAr: string;
  displayOrder: number;
};

function revalidateCategoryPages() {
  revalidatePath('/admin/projects/categories');
  revalidatePath('/en/admin/projects/categories');
  revalidatePath('/ar/admin/projects/categories');
}

export async function createCategory(data: ProjectCategoryFormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await prisma.projectCategory.create({
    data: {
      ...data,
    },
  });

  revalidateCategoryPages();
}

export async function updateCategory(id: string, data: ProjectCategoryFormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await prisma.projectCategory.update({
    where: { id },
    data,
  });

  revalidateCategoryPages();
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await prisma.projectCategory.delete({ where: { id } });
  revalidateCategoryPages();
}

export async function getCategory(id: string) {
  return prisma.projectCategory.findUnique({
    where: { id },
    include: {
      projects: {
        where: { deletedAt: null },
      },
    },
  });
}

export async function getCategories() {
  return prisma.projectCategory.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: {
          projects: {
            where: { deletedAt: null },
          },
        },
      },
    },
  });
}

export async function updateCategoryOrder(id: string, displayOrder: number) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await prisma.projectCategory.update({
    where: { id },
    data: { displayOrder },
  });

  revalidateCategoryPages();
}
