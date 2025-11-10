import type { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { settingsSchema, type SettingsFormValues } from '@/lib/validations/settings';
import { settingsRepository } from '@/repositories/settings';

function normalizeString(value?: string | null) {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function getSettings() {
  return settingsRepository.getSettings();
}

export async function updateSettings(values: SettingsFormValues) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const parsed = settingsSchema.parse(values);

  const emailRecipients = (parsed.emailRecipients || []).filter((recipient) => recipient.trim().length > 0);

  const smtpSettings = parsed.smtpSettings ? (parsed.smtpSettings as Prisma.JsonValue) : null;

  const payload = {
    siteNameEn: parsed.siteNameEn,
    siteNameAr: parsed.siteNameAr,
    siteDescriptionEn: normalizeString(parsed.siteDescriptionEn),
    siteDescriptionAr: normalizeString(parsed.siteDescriptionAr),
    primaryColor: parsed.primaryColor,
    accentColor: parsed.accentColor,
    defaultLanguage: parsed.defaultLanguage || 'en',
    seoMetaTitleEn: normalizeString(parsed.seoMetaTitleEn),
    seoMetaTitleAr: normalizeString(parsed.seoMetaTitleAr),
    seoMetaDescriptionEn: normalizeString(parsed.seoMetaDescriptionEn),
    seoMetaDescriptionAr: normalizeString(parsed.seoMetaDescriptionAr),
    googleAnalyticsId: normalizeString(parsed.googleAnalyticsId),
    emailRecipients,
    smtpSettings,
    recaptchaSiteKey: normalizeString(parsed.recaptchaSiteKey),
    recaptchaSecretKey: normalizeString(parsed.recaptchaSecretKey),
    maintenanceMode: parsed.maintenanceMode ?? false,
  };

  const settings = await settingsRepository.upsertSettings(payload, session.user.id);

  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/en');
  revalidatePath('/ar');

  return settings;
}
