"use server"

import { auth } from "@/auth"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { MessageStatus } from "@prisma/client"

export async function getMessages(status?: MessageStatus) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  return await prisma.message.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" }
  })
}

export async function getMessage(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  return await prisma.message.findUnique({
    where: { id }
  })
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  await prisma.message.update({
    where: { id },
    data: { status }
  })

  revalidatePath("/admin/messages")
}

export async function deleteMessage(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  await prisma.message.delete({
    where: { id }
  })

  revalidatePath("/admin/messages")
}

// For the public contact form
export async function createMessage(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  await prisma.message.create({
    data: {
      ...data,
      status: "NEW"
    }
  })

  revalidatePath("/admin/messages")
}