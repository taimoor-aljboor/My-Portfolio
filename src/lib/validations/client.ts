import { z } from 'zod';

export const clientSchema = z.object({
  nameEn: z.string().min(1, 'Name is required'),
  nameAr: z.string().optional().or(z.literal('')),
  logoUrl: z.string().optional().or(z.literal('')),
  websiteUrl: z.string().optional().or(z.literal('')),
  testimonialEn: z.string().optional().or(z.literal('')),
  testimonialAr: z.string().optional().or(z.literal('')),
  displayOrder: z.number().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
