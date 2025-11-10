import { revalidatePath } from 'next/cache';
import { MessageStatus } from '@prisma/client';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

function revalidateMessagePages() {
  revalidatePath('/admin/messages');
  revalidatePath('/en/admin/messages');
  revalidatePath('/ar/admin/messages');
}

export async function listMessages(status?: MessageStatus) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return prisma.message.findMany({
    where: status ? { status } : undefined,
    orderBy: { receivedAt: 'desc' },
  });
}

export async function getMessage(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return prisma.message.findUnique({ where: { id } });
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await prisma.message.update({
    where: { id },
    data: {
      status,
      processedAt: status === MessageStatus.NEW ? null : new Date(),
    },
  });

  revalidateMessagePages();
}

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await prisma.message.delete({ where: { id } });
  revalidateMessagePages();
}

export async function createMessage(data: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
  language?: string;
}) {
  await prisma.message.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.subject ?? null,
      message: data.message,
      language: data.language ?? 'en',
      status: MessageStatus.NEW,
      receivedAt: new Date(),
    },
  });

  revalidateMessagePages();
}
