import { z } from 'zod';

export const achievementSchema = z.object({
  titleEn: z.string().min(1, 'Title is required'),
  titleAr: z.string().optional().or(z.literal('')),
  descriptionEn: z.string().optional().or(z.literal('')),
  descriptionAr: z.string().optional().or(z.literal('')),
  issuedByEn: z.string().optional().or(z.literal('')),
  issuedByAr: z.string().optional().or(z.literal('')),
  achievedOn: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date()),
  linkUrl: z.string().url().optional().or(z.literal('')),
  logoUrl: z.string().optional().or(z.literal('')),
  displayOrder: z.number().optional(),
});

export type AchievementFormValues = z.infer<typeof achievementSchema>;
