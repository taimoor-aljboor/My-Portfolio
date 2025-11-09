import * as z from 'zod';

export const profileFormSchema = z.object({
  fullNameEn: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters long' }),
  fullNameAr: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters long' }),
  headlineEn: z
    .string()
    .min(10, { message: 'Headline must be at least 10 characters long' })
    .max(100, { message: 'Headline must not exceed 100 characters' }),
  headlineAr: z
    .string()
    .min(10, { message: 'Headline must be at least 10 characters long' })
    .max(100, { message: 'Headline must not exceed 100 characters' }),
  bioEn: z.string().min(50, { message: 'Bio must be at least 50 characters long' }),
  bioAr: z.string().min(50, { message: 'Bio must be at least 50 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  locationEn: z.string().min(2, { message: 'Location must be at least 2 characters long' }),
  locationAr: z.string().min(2, { message: 'Location must be at least 2 characters long' }),
  avatarUrl: z.string().url().optional(),
  cvPdfUrl: z.string().url().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    twitter: z.string().url().optional(),
    whatsapp: z.string().optional(),
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
    facebook: z.string().url().optional(),
    other: z.array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      })
    ).optional(),
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;