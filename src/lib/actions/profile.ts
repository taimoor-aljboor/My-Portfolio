import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { type ProfileFormValues } from '@/lib/validations/profile';

export async function updateProfile(data: ProfileFormValues) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const profile = await prisma.profile.findFirst();

  if (profile) {
    // Update existing profile
    return prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...data,
        updatedBy: session.user.email,
      },
    });
  }

  // Create new profile
  return prisma.profile.create({
    data: {
      ...data,
      createdBy: session.user.email,
      updatedBy: session.user.email,
    },
  });
}