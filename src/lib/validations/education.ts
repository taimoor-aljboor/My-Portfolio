import { z } from 'zod';

export const educationSchema = z.object({
  institutionEn: z.string().min(1, 'Institution is required'),
  institutionAr: z.string().optional().or(z.literal('')),
  degreeEn: z.string().optional().or(z.literal('')),
  degreeAr: z.string().optional().or(z.literal('')),
  fieldEn: z.string().optional().or(z.literal('')),
  fieldAr: z.string().optional().or(z.literal('')),
  startDate: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date()),
  endDate: z.preprocess((arg) => (arg ? new Date(arg as string) : undefined), z.date().optional()),
  grade: z.string().optional(),
  notesEn: z.string().optional(),
  notesAr: z.string().optional(),
  displayOrder: z.number().optional(),
});

export type EducationFormValues = z.infer<typeof educationSchema>;
