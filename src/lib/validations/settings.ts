import { z } from 'zod';

const hexColor = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export const settingsSchema = z.object({
  siteNameEn: z.string().min(2, 'Site name (EN) is required'),
  siteNameAr: z.string().min(2, 'Site name (AR) is required'),
  siteDescriptionEn: z.string().optional().or(z.literal('')),
  siteDescriptionAr: z.string().optional().or(z.literal('')),
  primaryColor: z.string().regex(hexColor, 'Primary color must be a valid hex color'),
  accentColor: z.string().regex(hexColor, 'Accent color must be a valid hex color'),
  defaultLanguage: z.string().default('en'),
  seoMetaTitleEn: z.string().optional().or(z.literal('')),
  seoMetaTitleAr: z.string().optional().or(z.literal('')),
  seoMetaDescriptionEn: z.string().optional().or(z.literal('')),
  seoMetaDescriptionAr: z.string().optional().or(z.literal('')),
  googleAnalyticsId: z.string().optional().or(z.literal('')),
  emailRecipients: z.array(z.string().email()).default([]),
  smtpSettings: z.record(z.string(), z.unknown()).optional(),
  recaptchaSiteKey: z.string().optional().or(z.literal('')),
  recaptchaSecretKey: z.string().optional().or(z.literal('')),
  maintenanceMode: z.boolean().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
