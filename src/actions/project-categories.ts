"use server"

import { auth } from "@/auth"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export type ProjectCategoryFormData = {
  nameEn: string
  nameAr: string
  slugEn: string
  slugAr: string
  displayOrder: number
}

export async function createCategory(data: ProjectCategoryFormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  await prisma.projectCategory.create({
    data
  })

  revalidatePath("/admin/projects/categories")
}

export async function updateCategory(id: string, data: ProjectCategoryFormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  await prisma.projectCategory.update({
    where: { id },
    data
  })

  revalidatePath("/admin/projects/categories")
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  await prisma.projectCategory.delete({
    where: { id }
  })

  revalidatePath("/admin/projects/categories")
}

export async function getCategory(id: string) {
  return await prisma.projectCategory.findUnique({
    where: { id },
    include: {
      projects: {
        where: { deletedAt: null }
      }
    }
  })
}

export async function getCategories() {
  return await prisma.projectCategory.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: {
          projects: {
            where: { deletedAt: null }
          }
        }
      }
    }
  })
}

export async function updateCategoryOrder(id: string, displayOrder: number) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  await prisma.projectCategory.update({
    where: { id },
    data: { displayOrder }
  })

  revalidatePath("/admin/projects/categories")
}