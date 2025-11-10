import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'nameRequired'),
  email: z.string().email('emailInvalid'),
  phone: z.string().optional(),
  message: z.string().min(10, 'messageTooShort'),
  locale: z.string().min(2),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
