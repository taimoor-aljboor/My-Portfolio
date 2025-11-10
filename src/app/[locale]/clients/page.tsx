import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getClients, getSettings, getPublicProfile } from '@/lib/queries/public';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, profile, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'seo.clients' }),
    getPublicProfile(locale),
    getSettings(),
  ]);

  const name = profile?.fullName ?? settings?.siteNameEn ?? 'Portfolio';

  return {
    title: t('title', { name }),
    description: t('description', { name }),
    alternates: { canonical: `/${locale}/clients` },
  };
}

export default async function ClientsPage({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, clients] = await Promise.all([
    getTranslations('home.clients'),
    getClients(locale),
  ]);

  return (
    <div className="container space-y-8 py-16">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle', { defaultValue: 'Organisations and partners I have collaborated with.' })}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <article key={client.id} className="rounded-xl border bg-card p-6 shadow-sm">
            {client.logoUrl ? (
              <div className="relative mx-auto h-20 w-32">
                <Image src={client.logoUrl} alt={client.name} fill className="object-contain" />
              </div>
            ) : (
              <h2 className="text-xl font-semibold">{client.name}</h2>
            )}
            <p className="mt-4 text-sm text-muted-foreground">{client.testimonial ?? ''}</p>
            {client.websiteUrl ? (
              <Link href={client.websiteUrl} className="mt-4 inline-flex text-sm text-primary" target="_blank">
                {t('visit', { defaultValue: 'Visit website' })}
              </Link>
            ) : null}
          </article>
        ))}
        {clients.length === 0 ? (
          <p className="text-muted-foreground">{t('empty', { defaultValue: 'Client stories coming soon.' })}</p>
        ) : null}
      </div>
    </div>
  );
}
