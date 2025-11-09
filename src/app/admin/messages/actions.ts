"use server"

import { revalidatePath } from "next/cache"

// Temporary type until database is fixed
type MessageStatus = "NEW" | "READ" | "ARCHIVED"

export async function updateMessageStatus(id: string, status: MessageStatus) {
  // TODO: Implement when database is ready
  console.log(`Update message ${id} status to ${status}`)
  revalidatePath("/admin/messages")
}

export async function deleteMessage(id: string) {
  // TODO: Implement when database is ready
  console.log(`Delete message ${id}`)
  revalidatePath("/admin/messages")
}