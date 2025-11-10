import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getCourses, getSettings, getPublicProfile } from '@/lib/queries/public';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, profile, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'seo.courses' }),
    getPublicProfile(locale),
    getSettings(),
  ]);

  const name = profile?.fullName ?? settings?.siteNameEn ?? 'Portfolio';

  return {
    title: t('title', { name }),
    description: t('description', { name }),
    alternates: { canonical: `/${locale}/courses` },
  };
}

export default async function CoursesPage({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, courses] = await Promise.all([
    getTranslations('about.courses'),
    getCourses(locale),
  ]);

  return (
    <div className="container space-y-8 py-16">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle', { defaultValue: 'Continuous learning and certifications.' })}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <article key={course.id} className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-sm text-muted-foreground">{course.provider}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(course.issuedOn))}
            </p>
            {course.notes ? <p className="mt-3 text-sm text-muted-foreground">{course.notes}</p> : null}
            {course.certificateUrl ? (
              <a href={course.certificateUrl} className="mt-4 inline-flex text-sm text-primary" target="_blank">
                {t('viewCertificate', { defaultValue: 'View certificate' })}
              </a>
            ) : null}
          </article>
        ))}
        {courses.length === 0 ? (
          <p className="text-muted-foreground">{t('empty', { defaultValue: 'Courses will be listed soon.' })}</p>
        ) : null}
      </div>
    </div>
  );
}
