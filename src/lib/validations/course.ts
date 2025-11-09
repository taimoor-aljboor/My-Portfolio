import { z } from 'zod';

export const courseSchema = z.object({
  titleEn: z.string().min(1, 'Title is required'),
  titleAr: z.string().optional().or(z.literal('')),
  providerEn: z.string().optional().or(z.literal('')),
  providerAr: z.string().optional().or(z.literal('')),
  issuedOn: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date()),
  certificateUrl: z.string().optional().or(z.literal('')),
  notesEn: z.string().optional().or(z.literal('')),
  notesAr: z.string().optional().or(z.literal('')),
  displayOrder: z.number().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
