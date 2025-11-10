import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  getPublicProfile,
  getEducationTimeline,
  getCourses,
  getExperiences,
  getProjectsForListing,
  getSettings,
} from '@/lib/queries/public';
import { formatDateRange } from '@/lib/utils/date';

function uniqueTechnologies(projects: Awaited<ReturnType<typeof getProjectsForListing>>) {
  const set = new Set<string>();
  projects.forEach((project) => project.techStack.forEach((tech) => set.add(tech)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }
  const [t, profile, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'seo.about' }),
    getPublicProfile(locale),
    getSettings(),
  ]);

  const name = profile?.fullName ?? settings?.siteNameEn ?? 'Portfolio';

  return {
    title: t('title', { name }),
    description: t('description', { name }),
    alternates: {
      canonical: `/${locale}/about`,
    },
  };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [t, profile, education, courses, experiences, projects] = await Promise.all([
    getTranslations('about'),
    getPublicProfile(locale),
    getEducationTimeline(locale),
    getCourses(locale),
    getExperiences(locale),
    getProjectsForListing({ locale }),
  ]);

  if (!profile) {
    return <div className="container py-20 text-center text-muted-foreground">Profile content coming soon.</div>;
  }

  const technologies = uniqueTechnologies(projects);
  const presentLabel = locale === 'ar' ? 'الحالي' : 'Present';

  return (
    <div className="container space-y-16 py-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <div className="prose max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: profile.bio }} />
          {profile.cvPdfUrl ? (
            <a
              href={profile.cvPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t('downloadCV')}
            </a>
          ) : null}
        </div>
        <aside className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{profile.fullName}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{profile.location}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Email: {profile.email}</li>
            {profile.phone ? <li>Phone: {profile.phone}</li> : null}
          </ul>
        </aside>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">{t('skills.title')}</h2>
        <div className="flex flex-wrap gap-3">
          {technologies.length ? (
            technologies.map((tech) => (
              <span key={tech} className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                {tech}
              </span>
            ))
          ) : (
            <p className="text-muted-foreground">Technologies will appear once projects are published.</p>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">{t('education.title')}</h2>
        </div>
        <div className="space-y-6">
          {education.map((item) => (
            <div key={item.id} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h3 className="text-xl font-semibold">{item.degree}</h3>
                  <p className="text-muted-foreground">{item.institution}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDateRange(locale, item.startDate, item.endDate, presentLabel)}
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.field}</p>
              {item.description ? <p className="mt-2 text-sm text-muted-foreground">{item.description}</p> : null}
            </div>
          ))}
          {education.length === 0 ? (
            <p className="text-muted-foreground">Education entries coming soon.</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold">{t('courses.title')}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <article key={course.id} className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.provider}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(new Date(course.issuedOn))}
              </p>
              {course.certificateUrl ? (
                <a href={course.certificateUrl} className="mt-4 inline-flex text-sm text-primary" target="_blank">
                  View certificate
                </a>
              ) : null}
            </article>
          ))}
          {courses.length === 0 ? <p className="text-muted-foreground">Courses will appear here soon.</p> : null}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold">{t('bio.title')}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {experiences.map((experience) => (
            <article key={experience.id} className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold">{experience.title}</h3>
              <p className="text-sm text-muted-foreground">{experience.company}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDateRange(locale, experience.startDate, experience.endDate, presentLabel)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{experience.description}</p>
            </article>
          ))}
          {experiences.length === 0 ? <p className="text-muted-foreground">Experience details coming soon.</p> : null}
        </div>
      </section>
    </div>
  );
}
