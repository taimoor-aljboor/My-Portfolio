"use server"

import { auth } from "@/auth"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { ProjectStatus } from "@prisma/client"

export type ProjectFormData = {
  titleEn: string
  titleAr: string
  shortDescEn: string
  shortDescAr: string
  longDescEn: string
  longDescAr: string
  slugEn: string
  slugAr: string
  techStack: string[]
  demoUrl?: string
  repoUrl?: string
  caseStudyUrl?: string
  status: ProjectStatus
  featured: boolean
  displayOrder: number
  dateFrom?: Date
  dateTo?: Date
  categoryId?: string
  images: {
    url: string
    type: string
    altTextEn?: string
    altTextAr?: string
    displayOrder: number
  }[]
  clients: string[] // Array of client IDs
}

export async function createProject(data: ProjectFormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  const project = await prisma.project.create({
    data: {
      ...data,
      createdBy: session.user.email,
      updatedBy: session.user.email,
      images: {
        create: data.images
      },
      clients: {
        connect: data.clients.map(id => ({ id }))
      }
    },
    include: {
      images: true,
      clients: true
    }
  })

  revalidatePath("/admin/projects")
  return project
}

export async function updateProject(id: string, data: ProjectFormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  // Delete existing images and create new ones
  await prisma.mediaAsset.deleteMany({
    where: { projectId: id }
  })

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...data,
      updatedBy: session.user.email,
      images: {
        create: data.images
      },
      clients: {
        set: data.clients.map(id => ({ id }))
      }
    },
    include: {
      images: true,
      clients: true
    }
  })

  revalidatePath("/admin/projects")
  return project
}

export async function deleteProject(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  // Soft delete by setting deletedAt
  await prisma.project.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedBy: session.user.email
    }
  })

  revalidatePath("/admin/projects")
}

export async function getProject(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { displayOrder: "asc" }
      },
      clients: true,
      category: true
    }
  })
}

export async function getProjects(includeDeleted = false) {
  return await prisma.project.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
    orderBy: [
      { featured: "desc" },
      { displayOrder: "asc" },
      { updatedAt: "desc" }
    ],
    include: {
      images: {
        orderBy: { displayOrder: "asc" },
        take: 1 // Get just the first image for preview
      },
      category: true
    }
  })
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  await prisma.project.update({
    where: { id },
    data: {
      status,
      updatedBy: session.user.email
    }
  })

  revalidatePath("/admin/projects")
}

export async function updateProjectOrder(id: string, displayOrder: number) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  await prisma.project.update({
    where: { id },
    data: {
      displayOrder,
      updatedBy: session.user.email
    }
  })

  revalidatePath("/admin/projects")
}

export async function toggleProjectFeatured(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) throw new Error("Project not found")

  await prisma.project.update({
    where: { id },
    data: {
      featured: !project.featured,
      updatedBy: session.user.email
    }
  })

  revalidatePath("/admin/projects")
}