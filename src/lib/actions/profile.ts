import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { profileFormSchema, type ProfileFormValues } from '@/lib/validations/profile';
import { profileRepository } from '@/repositories/profile';

function normalizeOptional(value?: string | null) {
  if (typeof value === 'string' && value.trim().length === 0) {
    return null;
  }
  return typeof value === 'undefined' ? null : value;
}

export async function updateProfile(data: ProfileFormValues) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const parsed = profileFormSchema.parse(data);

  const payload = {
    fullNameEn: parsed.fullNameEn,
    fullNameAr: parsed.fullNameAr,
    headlineEn: parsed.headlineEn,
    headlineAr: parsed.headlineAr,
    bioEn: parsed.bioEn,
    bioAr: parsed.bioAr,
    email: parsed.email,
    phone: normalizeOptional(parsed.phone),
    locationEn: parsed.locationEn,
    locationAr: parsed.locationAr,
    avatarUrl: normalizeOptional(parsed.avatarUrl),
    cvPdfUrl: normalizeOptional(parsed.cvPdfUrl),
    socialLinks: parsed.socialLinks as any,
  };

  const profile = await profileRepository.upsertProfile(payload, session.user.id);

  revalidatePath('/admin/profile');
  revalidatePath('/');
  revalidatePath('/en');
  revalidatePath('/ar');

  return profile;
}
