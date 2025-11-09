import { type Profile } from '@prisma/client';
import { type ProfileFormValues } from '@/lib/validations/profile';

export function mapProfileToFormValues(
  profile: Profile | null
): ProfileFormValues | undefined {
  if (!profile) return undefined;

  const socialLinks = profile.socialLinks as Record<string, any>;

  return {
    fullNameEn: profile.fullNameEn,
    fullNameAr: profile.fullNameAr,
    headlineEn: profile.headlineEn,
    headlineAr: profile.headlineAr,
    bioEn: profile.bioEn,
    bioAr: profile.bioAr,
    email: profile.email,
    phone: profile.phone ?? undefined,
    locationEn: profile.locationEn,
    locationAr: profile.locationAr,
    avatarUrl: profile.avatarUrl ?? undefined,
    cvPdfUrl: profile.cvPdfUrl ?? undefined,
    socialLinks: {
      linkedin: socialLinks?.linkedin,
      github: socialLinks?.github,
      twitter: socialLinks?.twitter,
      whatsapp: socialLinks?.whatsapp,
      instagram: socialLinks?.instagram,
      youtube: socialLinks?.youtube,
      facebook: socialLinks?.facebook,
      other: socialLinks?.other ?? [],
    },
  };
}