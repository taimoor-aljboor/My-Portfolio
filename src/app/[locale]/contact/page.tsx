import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPublicProfile, getSettings } from '@/lib/queries/public';
import { ContactForm } from '@/components/contact-form';
import Link from 'next/link';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, profile, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'seo.contact' }),
    getPublicProfile(locale),
    getSettings(),
  ]);

  const name = profile?.fullName ?? settings?.siteNameEn ?? 'Portfolio';

  return {
    title: t('title', { name }),
    description: t('description', { name }),
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, profile, settings] = await Promise.all([
    getTranslations('contact'),
    getPublicProfile(locale),
    getSettings(),
  ]);

  return (
    <div className="container grid gap-12 py-16 lg:grid-cols-[1fr_0.8fr]">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('intro', { defaultValue: 'Feel free to reach out for collaborations or just a friendly hello.' })}
        </p>
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{t('info.title', { defaultValue: 'Contact information' })}</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {profile?.email ? (
              <li>
                {t('info.email')}: <Link href={`mailto:${profile.email}`} className="text-primary">{profile.email}</Link>
              </li>
            ) : null}
            {profile?.phone ? (
              <li>
                {t('info.phone')}: <Link href={`tel:${profile.phone}`} className="text-primary">{profile.phone}</Link>
              </li>
            ) : null}
          </ul>
          {settings?.emailRecipients?.length ? (
            <p className="text-xs text-muted-foreground">
              {t('info.response', { defaultValue: 'Messages are delivered to the configured inbox instantly.' })}
            </p>
          ) : null}
        </div>
      </section>
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <ContactForm />
      </section>
    </div>
  );
}
