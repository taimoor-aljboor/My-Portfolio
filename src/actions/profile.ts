"use server"

import { auth } from "@/auth"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export type ProfileFormData = {
  fullNameEn: string
  fullNameAr: string
  headlineEn: string
  headlineAr: string
  bioEn: string
  bioAr: string
  email: string
  phone?: string
  locationEn: string
  locationAr: string
  avatarUrl?: string
  cvPdfUrl?: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    github?: string
    instagram?: string
    youtube?: string
    facebook?: string
    whatsapp?: string
    other?: { label: string; url: string }[]
  }
}

export async function updateProfile(data: ProfileFormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  const profile = await prisma.profile.findFirst()

  if (profile) {
    // Update existing profile
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...data,
        socialLinks: data.socialLinks as any, // Type casting needed for JSON field
        updatedBy: session.user.email
      }
    })
  } else {
    // Create new profile
    await prisma.profile.create({
      data: {
        ...data,
        socialLinks: data.socialLinks as any, // Type casting needed for JSON field
        createdBy: session.user.email,
        updatedBy: session.user.email
      }
    })
  }

  revalidatePath("/admin/profile")
}

export async function getProfile() {
  const profile = await prisma.profile.findFirst()
  return profile
}