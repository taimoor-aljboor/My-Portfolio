import { z } from "zod";

export const projectSchema = z.object({
  titleEn: z.string().min(1, 'Title is required'),
  titleAr: z.string().optional().or(z.literal('')),
  descriptionEn: z.string().optional().or(z.literal('')),
  descriptionAr: z.string().optional().or(z.literal('')),
  url: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  techs: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  imageUrl: z.string().optional().or(z.literal('')),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
