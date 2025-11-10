import { z } from 'zod';

export const educationSchema = z.object({
  institutionEn: z.string().min(1, 'Institution is required'),
  institutionAr: z.string().optional().or(z.literal('')),
  degreeEn: z.string().optional().or(z.literal('')),
  degreeAr: z.string().optional().or(z.literal('')),
  fieldEn: z.string().optional().or(z.literal('')),
  fieldAr: z.string().optional().or(z.literal('')),
  locationEn: z.string().optional().or(z.literal('')),
  locationAr: z.string().optional().or(z.literal('')),
  startDate: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date()),
  endDate: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date().optional()),
  gpa: z
    .preprocess((value) => {
      if (value === undefined || value === null || value === '') return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }, z.number().min(0).max(4).optional()),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  displayOrder: z.number().optional(),
});

export type EducationFormValues = z.infer<typeof educationSchema>;
