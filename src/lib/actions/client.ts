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
      nameAr: parsed.nameAr || null,
      logoUrl: parsed.logoUrl || null,
      websiteUrl: parsed.websiteUrl || null,
      testimonialEn: parsed.testimonialEn || null,
      testimonialAr: parsed.testimonialAr || null,
      displayOrder: parsed.displayOrder ?? 0,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });
}

export async function updateClient(id: string, data: Partial<ClientFormValues>) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const safeData: any = {};
  if (typeof data.nameEn !== 'undefined') safeData.nameEn = data.nameEn;
  if (typeof data.nameAr !== 'undefined') safeData.nameAr = data.nameAr || null;
  if (typeof data.logoUrl !== 'undefined') safeData.logoUrl = data.logoUrl || null;
  if (typeof data.websiteUrl !== 'undefined') safeData.websiteUrl = data.websiteUrl || null;
  if (typeof data.testimonialEn !== 'undefined') safeData.testimonialEn = data.testimonialEn || null;
  if (typeof data.testimonialAr !== 'undefined') safeData.testimonialAr = data.testimonialAr || null;
  if (typeof data.displayOrder !== 'undefined') safeData.displayOrder = data.displayOrder;

  safeData.updatedBy = session.user.email;

  return prisma.client.update({ where: { id }, data: safeData });
}

export async function softDeleteClient(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  return prisma.client.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: session.user.email } });
}
