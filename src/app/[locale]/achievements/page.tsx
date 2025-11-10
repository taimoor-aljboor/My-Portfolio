import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getRecentAchievements, getSettings, getPublicProfile } from '@/lib/queries/public';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, profile, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'seo.achievements' }),
    getPublicProfile(locale),
    getSettings(),
  ]);

  const name = profile?.fullName ?? settings?.siteNameEn ?? 'Portfolio';

  return {
    title: t('title', { name }),
    description: t('description', { name }),
    alternates: { canonical: `/${locale}/achievements` },
  };
}

export default async function AchievementsPage({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, achievements] = await Promise.all([
    getTranslations('home.achievements'),
    getRecentAchievements(locale, 20),
  ]);

  return (
    <div className="container space-y-8 py-16">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle', { defaultValue: 'Highlights of certifications, awards, and accomplishments.' })}
        </p>
      </div>
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <article key={achievement.id} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-2xl font-semibold">{achievement.title}</h2>
                <p className="text-sm text-muted-foreground">{achievement.issuer}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(achievement.achievedOn))}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{achievement.description}</p>
            {achievement.linkUrl ? (
              <a href={achievement.linkUrl} className="mt-4 inline-flex text-sm text-primary" target="_blank">
                {t('learnMore', { defaultValue: 'Learn more' })}
              </a>
            ) : null}
          </article>
        ))}
        {achievements.length === 0 ? (
          <p className="text-muted-foreground">{t('empty', { defaultValue: 'Achievements will be added soon.' })}</p>
        ) : null}
      </div>
    </div>
  );
}
