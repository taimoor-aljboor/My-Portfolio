import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import {
  getPublicProfile,
  getFeaturedProjects,
  getPortfolioStats,
  getClients,
  getRecentAchievements,
  getSettings,
} from '@/lib/queries/public';
import { ProjectCard } from '@/components/site/project-card';

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
  }).format(new Date(date));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }
  const [t, profile, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'seo.home' }),
    getPublicProfile(locale),
    getSettings(),
  ]);

  const name = profile?.fullName ?? settings?.siteNameEn ?? 'Portfolio';
  const description = t('description', { name });
  const title = t('title', { name });

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      type: 'website',
    },
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, profile, featuredProjects, stats, clients, achievements] = await Promise.all([
    getTranslations('home'),
    getPublicProfile(locale),
    getFeaturedProjects(locale, 3),
    getPortfolioStats(locale),
    getClients(locale),
    getRecentAchievements(locale, 3),
  ]);

  const heroName = profile?.fullName ?? 'Your Name';
  const headline = profile?.headline ?? 'Full Stack Developer';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: heroName,
    jobTitle: headline,
    email: profile?.email,
    url: `https://example.com/${locale}`,
  };

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container grid gap-10 py-20 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <span className="text-sm uppercase tracking-wider text-primary">{t('hero.greeting')}</span>
            <h1 className="text-balance text-4xl font-bold sm:text-5xl">
              {heroName}
            </h1>
            <p className="text-lg text-muted-foreground">{headline}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                {t('hero.cta')}
              </Link>
              {profile?.cvPdfUrl ? (
                <a
                  href={profile.cvPdfUrl}
                  className="inline-flex items-center rounded-lg border border-input px-6 py-3 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('hero.downloadCV')}
                </a>
              ) : null}
            </div>
          </div>
          <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full border border-primary/40 shadow-lg">
            {profile?.avatarUrl ? (
              <Image src={profile.avatarUrl} alt={heroName} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 text-4xl font-semibold text-primary">
                {heroName
                  .split(' ')
                  .map((part) => part.charAt(0))
                  .join('')
                  .slice(0, 2)}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{t('featuredProjects.title')}</h2>
          <Link href={`/${locale}/projects`} className="text-sm font-semibold text-primary hover:underline">
            {t('featuredProjects.viewAll')}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
          {featuredProjects.length === 0 ? (
            <div className="rounded-xl border p-6 text-muted-foreground">
              {t('featuredProjects.empty', { defaultValue: 'Content coming soon.' })}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-4xl font-bold text-primary">{stats.projects}</p>
            <p className="text-sm text-muted-foreground">{t('stats.projects')}</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">{stats.experienceYears}</p>
            <p className="text-sm text-muted-foreground">{t('stats.experience')}</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">{stats.clients}</p>
            <p className="text-sm text-muted-foreground">{t('stats.clients')}</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">{stats.technologies}</p>
            <p className="text-sm text-muted-foreground">{t('stats.technologies')}</p>
          </div>
        </div>
      </section>

      <section className="container space-y-6">
        <h2 className="text-3xl font-bold">{t('clients.title')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clients.map((client) => (
            <div key={client.id} className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6">
              {client.logoUrl ? (
                <Image src={client.logoUrl} alt={client.name} width={120} height={60} className="object-contain" />
              ) : (
                <span className="text-lg font-semibold">{client.name}</span>
              )}
              <p className="text-center text-sm text-muted-foreground">{client.testimonial ?? ''}</p>
              {client.websiteUrl ? (
                <Link href={client.websiteUrl} className="text-sm text-primary" target="_blank">
                  Visit
                </Link>
              ) : null}
            </div>
          ))}
          {clients.length === 0 ? (
            <div className="rounded-xl border p-6 text-muted-foreground">
              {locale === 'en' ? 'Client stories coming soon.' : 'قصص العملاء قادمة قريبًا.'}
            </div>
          ) : null}
        </div>
      </section>

      <section className="container space-y-6">
        <h2 className="text-3xl font-bold">{t('achievements.title')}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {achievements.map((achievement) => (
            <article key={achievement.id} className="rounded-xl border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">
                {formatDate(achievement.achievedOn, locale)}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{achievement.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{achievement.description}</p>
              {achievement.linkUrl ? (
                <Link href={achievement.linkUrl} className="mt-4 inline-flex text-sm text-primary" target="_blank">
                  Learn more
                </Link>
              ) : null}
            </article>
          ))}
          {achievements.length === 0 ? (
            <div className="rounded-xl border p-6 text-muted-foreground">
              {locale === 'en' ? 'Achievements coming soon.' : 'الإنجازات قادمة قريبًا.'}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10 py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">{t('cta.title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t('cta.description')}</p>
          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-flex items-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>

      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(structuredData)}
      </script>
    </div>
  );
}
