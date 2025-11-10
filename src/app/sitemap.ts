import type { MetadataRoute } from 'next';
import { getProjectsForListing } from '@/lib/queries/public';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://example.com';
const LOCALES = ['en', 'ar'] as const;
const STATIC_ROUTES = ['/', '/about', '/projects', '/achievements', '/education', '/courses', '/clients', '/contact'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  await Promise.all(
    LOCALES.map(async (locale) => {
      const projects = await getProjectsForListing({ locale });

      STATIC_ROUTES.forEach((route) => {
        entries.push({
          url: `${BASE_URL}/${locale}${route === '/' ? '' : route}`,
          lastModified: new Date(),
        });
      });

      projects.forEach((project) => {
        entries.push({
          url: `${BASE_URL}/${locale}/projects/${project.slug}`,
          lastModified: new Date(project.updatedAt),
        });
      });
    })
  );

  return entries;
}
