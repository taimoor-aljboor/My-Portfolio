import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  getProjectsForListing,
  getProjectTechnologies,
  getSettings,
  getPublicProfile,
} from '@/lib/queries/public';
import { ProjectCard } from '@/components/site/project-card';
import { ProjectFilters, type ProjectFilterState } from '@/components/site/project-filters';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }
  const [t, profile, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'seo.projects' }),
    getPublicProfile(locale),
    getSettings(),
  ]);

  const name = profile?.fullName ?? settings?.siteNameEn ?? 'Portfolio';

  return {
    title: t('title', { name }),
    description: t('description', { name }),
    alternates: {
      canonical: `/${locale}/projects`,
    },
  };
}

type ProjectsPageProps = {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function ProjectsPage({ params: { locale }, searchParams }: ProjectsPageProps) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const filters: ProjectFilterState = {
    query: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    technology: typeof searchParams.tech === 'string' ? searchParams.tech : undefined,
    sort:
      typeof searchParams.sort === 'string' &&
      ['recent', 'oldest', 'name'].includes(searchParams.sort)
        ? (searchParams.sort as ProjectFilterState['sort'])
        : 'recent',
    featured: searchParams.featured === 'true',
  };

  const [t, projects, technologies] = await Promise.all([
    getTranslations('projects'),
    getProjectsForListing({
      locale,
      query: filters.query,
      technology: filters.technology,
      sort: filters.sort,
      featured: filters.featured,
    }),
    getProjectTechnologies(),
  ]);

  return (
    <div className="container space-y-10 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle', { defaultValue: 'Browse my latest work and case studies.' })}</p>
      </div>

      <ProjectFilters technologies={technologies} initialState={filters} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
      {projects.length === 0 ? (
        <div className="rounded-xl border p-10 text-center text-muted-foreground">
          {t('empty', { defaultValue: 'No projects match the selected filters.' })}
        </div>
      ) : null}
    </div>
  );
}
