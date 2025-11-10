import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getEducationTimeline, getSettings, getPublicProfile } from '@/lib/queries/public';
import { formatDateRange } from '@/lib/utils/date';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, profile, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'seo.education' }),
    getPublicProfile(locale),
    getSettings(),
  ]);

  const name = profile?.fullName ?? settings?.siteNameEn ?? 'Portfolio';

  return {
    title: t('title', { name }),
    description: t('description', { name }),
    alternates: { canonical: `/${locale}/education` },
  };
}

export default async function EducationPage({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, education] = await Promise.all([
    getTranslations('about.education'),
    getEducationTimeline(locale),
  ]);

  const presentLabel = locale === 'ar' ? 'الحالي' : 'Present';

  return (
    <div className="container space-y-8 py-16">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle', { defaultValue: 'Academic background and milestones.' })}
        </p>
      </div>
      <div className="space-y-4">
        {education.map((item) => (
          <article key={item.id} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-2xl font-semibold">{item.degree}</h2>
                <p className="text-sm text-muted-foreground">{item.institution}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDateRange(locale, item.startDate, item.endDate, presentLabel)}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{item.field}</p>
            {item.description ? <p className="mt-3 text-sm text-muted-foreground">{item.description}</p> : null}
          </article>
        ))}
        {education.length === 0 ? (
          <p className="text-muted-foreground">{t('empty', { defaultValue: 'Education history coming soon.' })}</p>
        ) : null}
      </div>
    </div>
  );
}
