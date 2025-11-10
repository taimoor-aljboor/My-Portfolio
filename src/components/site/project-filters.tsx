'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export type ProjectFilterState = {
  query?: string;
  technology?: string;
  sort?: 'recent' | 'oldest' | 'name';
  featured?: boolean;
};

type ProjectFiltersProps = {
  technologies: string[];
  initialState: ProjectFilterState;
};

type SortOption = NonNullable<ProjectFilterState['sort']>;

export function ProjectFilters({ technologies, initialState }: ProjectFiltersProps) {
  const t = useTranslations('projects');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialState.query ?? '');
  const [technology, setTechnology] = useState(initialState.technology ?? '');
  const [sort, setSort] = useState<SortOption>(initialState.sort ?? 'recent');
  const [featured, setFeatured] = useState(initialState.featured ?? false);

  useEffect(() => {
    setSearch(initialState.query ?? '');
  }, [initialState.query]);

  const updateUrl = useMemo(() => {
    return (params: ProjectFilterState) => {
      const next = new URLSearchParams(searchParams.toString());
      if (params.query && params.query.trim().length > 0) {
        next.set('q', params.query.trim());
      } else {
        next.delete('q');
      }

      if (params.technology) {
        next.set('tech', params.technology);
      } else {
        next.delete('tech');
      }

      if (params.sort) {
        next.set('sort', params.sort);
      } else {
        next.delete('sort');
      }

      if (params.featured) {
        next.set('featured', 'true');
      } else {
        next.delete('featured');
      }

      const searchString = next.toString();
      router.replace(`${pathname}${searchString ? `?${searchString}` : ''}`);
    };
  }, [router, pathname, searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateUrl({ query: search, technology, sort, featured });
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, technology, sort, featured, updateUrl]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-1 flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="project-search">
          {t('filters.searchLabel', { defaultValue: 'Search projects' })}
        </label>
        <Input
          id="project-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('filters.searchPlaceholder', { defaultValue: 'Search by title or description' })}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="project-tech">
          {t('filters.technology')}
        </label>
        <select
          id="project-tech"
          value={technology}
          onChange={(event) => setTechnology(event.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">{t('filters.all')}</option>
          {technologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="project-sort">
          {t('sort.label', { defaultValue: 'Sort by' })}
        </label>
        <select
          id="project-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="recent">{t('sort.recent')}</option>
          <option value="oldest">{t('sort.oldest')}</option>
          <option value="name">{t('sort.name')}</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="project-featured">
          {t('filters.featured', { defaultValue: 'Featured only' })}
        </label>
        <div className="flex items-center gap-2">
          <input
            id="project-featured"
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">{t('filters.featuredLabel', { defaultValue: 'Show featured only' })}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="justify-start px-0 text-xs text-primary"
          onClick={() => {
            setSearch('');
            setTechnology('');
            setSort('recent');
            setFeatured(false);
            updateUrl({});
          }}
        >
          {t('filters.reset', { defaultValue: 'Reset filters' })}
        </Button>
      </div>
    </div>
  );
}
