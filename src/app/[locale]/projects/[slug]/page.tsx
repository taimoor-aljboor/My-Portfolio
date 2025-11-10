import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  getProjectBySlug,
  getProjectsForListing,
  getSettings,
  getPublicProfile,
} from '@/lib/queries/public';

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const project = await getProjectBySlug(slug, locale);
  if (!project) {
    return {};
  }

  const [settings, profile] = await Promise.all([getSettings(), getPublicProfile(locale)]);

  const title = project.title;
  const description = project.shortDescription;
  const canonicalSlug = locale === 'ar' ? project.slug : project.slug;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects/${canonicalSlug}`,
    },
    openGraph: {
      title,
      description,
      images: project.heroImage ? [project.heroImage] : [],
      url: `/${locale}/projects/${canonicalSlug}`,
      type: 'article',
    },
    authors: profile ? [{ name: profile.fullName }] : undefined,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: project.heroImage ? [project.heroImage] : undefined,
    },
  };
}

type ProjectDetailsPageProps = {
  params: { locale: string; slug: string };
};

export default async function ProjectDetailsPage({ params: { locale, slug } }: ProjectDetailsPageProps) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const project = await getProjectBySlug(slug, locale);
  if (!project) {
    notFound();
  }

  const firstTech = project.techStack[0];
  const [t, relatedProjects] = await Promise.all([
    getTranslations('projects'),
    getProjectsForListing({
      locale,
      technology: firstTech,
      featured: false,
    }),
  ]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription,
    inLanguage: locale,
    url: `https://example.com/${locale}/projects/${project.slug}`,
  };

  return (
    <div className="container space-y-16 py-16">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-primary">{t('details.category', { defaultValue: 'Project' })}</p>
        <h1 className="text-4xl font-bold">{project.title}</h1>
        <p className="text-lg text-muted-foreground">{project.shortDescription}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {project.clientNames.length ? <span>{project.clientNames.join(', ')}</span> : null}
          {project.dateFrom ? (
            <span>
              {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(project.dateFrom))}
            </span>
          ) : null}
        </div>
      </header>

      {project.heroImage ? (
        <div className="relative aspect-video overflow-hidden rounded-xl border">
          <Image src={project.heroImage} alt={project.heroAlt ?? project.title} fill className="object-cover" priority />
        </div>
      ) : null}

      <section className="prose max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: project.longDescription }} />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t('details.technologies')}</h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">{t('details.related')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProjects
            .filter((related) => related.id !== project.id)
            .slice(0, 3)
            .map((related) => (
              <div key={related.id} className="rounded-xl border p-6">
                <h3 className="text-lg font-semibold">{related.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{related.shortDescription}</p>
                <Link href={`/${locale}/projects/${related.slug}`} className="mt-4 inline-flex text-sm text-primary">
                  {t('details.view')}
                </Link>
              </div>
            ))}
          {relatedProjects.length <= 1 ? (
            <p className="text-muted-foreground">{t('details.empty', { defaultValue: 'More case studies coming soon.' })}</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">{t('details.links', { defaultValue: 'Project links' })}</h2>
        <div className="flex flex-wrap gap-4">
          {project.demoUrl ? (
            <Link href={project.demoUrl} className="text-sm text-primary" target="_blank">
              {t('details.demo')}
            </Link>
          ) : null}
          {project.repoUrl ? (
            <Link href={project.repoUrl} className="text-sm text-primary" target="_blank">
              {t('details.repository')}
            </Link>
          ) : null}
          {project.caseStudyUrl ? (
            <Link href={project.caseStudyUrl} className="text-sm text-primary" target="_blank">
              {t('details.caseStudy')}
            </Link>
          ) : null}
        </div>
      </section>

      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(structuredData)}
      </script>
    </div>
  );
}
