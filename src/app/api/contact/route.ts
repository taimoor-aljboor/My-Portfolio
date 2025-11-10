import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { contactSchema } from '@/lib/validations/contact';
import { sendContactEmail } from '@/lib/utils/mailer';

async function verifyRecaptcha(token: string, secret: string) {
  const params = new URLSearchParams({ secret, response: token });
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid', issues: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, phone, message, locale, honeypot, recaptchaToken } = parsed.data;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    const settings = await prisma.settings.findFirst();

    if (settings?.recaptchaSecretKey) {
      if (!recaptchaToken) {
        return NextResponse.json({ error: 'recaptchaRequired' }, { status: 400 });
      }

      const valid = await verifyRecaptcha(recaptchaToken, settings.recaptchaSecretKey);
      if (!valid) {
        return NextResponse.json({ error: 'recaptchaFailed' }, { status: 400 });
      }
    }

    const created = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        language: locale,
      },
    });

    if (settings?.emailRecipients?.length) {
      await sendContactEmail({
        name,
        email,
        phone,
        message,
        locale,
        recipients: settings.emailRecipients,
        settingsSmtp: settings.smtpSettings as Record<string, unknown> | null | undefined,
      });
    }

    return NextResponse.json({ success: true, id: created.id });
  } catch (error) {
    console.error('Contact form error', error);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
