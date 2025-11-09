import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { clientSchema, type ClientFormValues } from '@/lib/validations/client';

export async function listClients() {
  return prisma.client.findMany({ where: { deletedAt: null }, orderBy: { displayOrder: 'asc' } });
}

export async function getClient(id: string) {
  return prisma.client.findUnique({ where: { id } });
}

export async function createClient(data: ClientFormValues) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const parsed = clientSchema.parse(data as any);

  return prisma.client.create({
    data: {
      nameEn: parsed.nameEn,
      nameAr: parsed.nameAr || '',
      logoUrl: parsed.logoUrl || null,
      websiteUrl: parsed.websiteUrl || null,
      testimonialEn: parsed.testimonialEn || null,
      testimonialAr: parsed.testimonialAr || null,
      displayOrder: parsed.displayOrder || 0,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });
}

export async function updateClient(id: string, data: Partial<ClientFormValues>) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const safeData: any = {};
  if (data.nameEn) safeData.nameEn = data.nameEn;
  if (data.nameAr) safeData.nameAr = data.nameAr;
  if (data.logoUrl) safeData.logoUrl = data.logoUrl;
  if (data.websiteUrl) safeData.websiteUrl = data.websiteUrl;
  if (data.testimonialEn) safeData.testimonialEn = data.testimonialEn;
  if (data.testimonialAr) safeData.testimonialAr = data.testimonialAr;
  if (typeof data.displayOrder !== 'undefined') safeData.displayOrder = data.displayOrder;

  safeData.updatedBy = session.user.email;

  return prisma.client.update({ where: { id }, data: safeData });
}

export async function softDeleteClient(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  return prisma.client.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: session.user.email } });
}
