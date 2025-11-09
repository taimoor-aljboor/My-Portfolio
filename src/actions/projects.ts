"use server"

import { auth } from "@/auth"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { ProjectStatus } from "@prisma/client"

type ProjectImageInput = {
  url: string
  type: string
  altTextEn?: string
  altTextAr?: string
  displayOrder: number
}

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
  images: ProjectImageInput[]
  clientIds: string[]
}

function normalizeProject<T extends {
  projectClients: Array<{ client: any }>
}>(project: T) {
  const { projectClients, ...rest } = project
  return {
    ...rest,
    clients: projectClients.map((pc) => pc.client),
  }
}

export async function createProject(data: ProjectFormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  const { clientIds, images, ...projectData } = data

  const project = await prisma.project.create({
    data: {
      ...projectData,
      createdBy: session.user.email,
      updatedBy: session.user.email,
      images: {
        create: images
      },
      projectClients: {
        create: clientIds.map((clientId) => ({
          client: { connect: { id: clientId } }
        }))
      }
    },
    include: {
      images: true,
      projectClients: {
        include: { client: true }
      }
    }
  })

  revalidatePath("/admin/projects")
  return normalizeProject(project)
}

export async function updateProject(id: string, data: ProjectFormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  const { clientIds, images, ...projectData } = data

  // Delete existing images and create new ones
  await prisma.mediaAsset.deleteMany({
    where: { projectId: id }
  })

  await prisma.projectClient.deleteMany({
    where: { projectId: id }
  })

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...projectData,
      updatedBy: session.user.email,
      images: {
        create: images
      },
      projectClients: {
        create: clientIds.map((clientId) => ({
          client: { connect: { id: clientId } }
        }))
      }
    },
    include: {
      images: true,
      projectClients: {
        include: { client: true }
      }
    }
  })

  revalidatePath("/admin/projects")
  return normalizeProject(project)
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
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { displayOrder: "asc" }
      },
      projectClients: {
        include: { client: true }
      },
      category: true
    }
  })
  if (!project) return null
  return normalizeProject(project)
}

export async function getProjects(includeDeleted = false) {
  const projects = await prisma.project.findMany({
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
      projectClients: {
        include: { client: true }
      },
      category: true
    }
  })
  return projects.map(normalizeProject)
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