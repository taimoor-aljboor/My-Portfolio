import { cache } from 'react';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';

function localizeField<T extends Record<string, any>>(record: T, key: string, locale: string) {
  const localizedKey = locale === 'ar' ? `${key}Ar` : `${key}En`;
  const fallbackKey = locale === 'ar' ? `${key}En` : `${key}Ar`;
  return (record[localizedKey] ?? record[fallbackKey] ?? '') as string;
}

function toISODate(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

export type LocalizedProfile = {
  id: string;
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  phone?: string | null;
  location: string;
  avatarUrl?: string | null;
  cvPdfUrl?: string | null;
  socialLinks: Record<string, unknown>;
};

export const getPublicProfile = cache(async (locale: string): Promise<LocalizedProfile | null> => {
  const profile = await prisma.profile.findFirst();
  if (!profile) return null;

  return {
    id: profile.id,
    fullName: localizeField(profile, 'fullName', locale),
    headline: localizeField(profile, 'headline', locale),
    bio: localizeField(profile, 'bio', locale),
    email: profile.email,
    phone: profile.phone,
    location: localizeField(profile, 'location', locale),
    avatarUrl: profile.avatarUrl,
    cvPdfUrl: profile.cvPdfUrl,
    socialLinks: (profile.socialLinks as Record<string, unknown>) ?? {},
  };
});

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    images: true;
    projectClients: { include: { client: true } };
    category: true;
  };
}>;

export type LocalizedProject = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  slug: string;
  techStack: string[];
  featured: boolean;
  status: string;
  dateFrom: string | null;
  dateTo: string | null;
  displayOrder: number;
  demoUrl?: string | null;
  repoUrl?: string | null;
  caseStudyUrl?: string | null;
  heroImage?: string | null;
  heroAlt?: string | null;
  clientNames: string[];
  category?: string | null;
  updatedAt: string;
};

function mapProject(project: ProjectWithRelations, locale: string): LocalizedProject {
  const sortedImages = [...(project.images ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  const coverImage = sortedImages[0];
  const clientNames = project.projectClients?.map((relation) =>
    localizeField(relation.client, 'name', locale)
  );

  return {
    id: project.id,
    title: localizeField(project, 'title', locale),
    shortDescription: localizeField(project, 'shortDesc', locale),
    longDescription: localizeField(project, 'longDesc', locale),
    slug: locale === 'ar' ? project.slugAr : project.slugEn,
    techStack: project.techStack ?? [],
    featured: project.featured,
    status: project.status,
    dateFrom: toISODate(project.dateFrom),
    dateTo: toISODate(project.dateTo),
    displayOrder: project.displayOrder,
    demoUrl: project.demoUrl,
    repoUrl: project.repoUrl,
    caseStudyUrl: project.caseStudyUrl,
    heroImage: coverImage?.url ?? null,
    heroAlt: locale === 'ar' ? coverImage?.altTextAr ?? null : coverImage?.altTextEn ?? null,
    clientNames: clientNames ?? [],
    category: project.category ? localizeField(project.category, 'name', locale) : null,
    updatedAt: project.updatedAt.toISOString(),
  };
}

export type ProjectFilters = {
  locale: string;
  query?: string;
  technology?: string;
  featured?: boolean;
  sort?: 'recent' | 'oldest' | 'name';
};

function buildProjectOrder(sort?: 'recent' | 'oldest' | 'name') {
  switch (sort) {
    case 'oldest':
      return [{ dateFrom: 'asc' as const }, { createdAt: 'asc' as const }];
    case 'name':
      return [{ titleEn: 'asc' as const }];
    default:
      return [{ featured: 'desc' as const }, { dateFrom: 'desc' as const }, { createdAt: 'desc' as const }];
  }
}

export const getProjectsForListing = cache(async (filters: ProjectFilters) => {
  const where: Prisma.ProjectWhereInput = {
    deletedAt: null,
    status: 'PUBLISHED',
  };

  if (filters.featured) {
    where.featured = true;
  }

  if (filters.technology) {
    where.techStack = {
      has: filters.technology,
    };
  }

  if (filters.query) {
    const search = filters.query.trim();
    if (search.length > 0) {
      where.OR = [
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { shortDescEn: { contains: search, mode: 'insensitive' } },
        { shortDescAr: { contains: search, mode: 'insensitive' } },
      ];
    }
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      images: true,
      projectClients: { include: { client: true } },
      category: true,
    },
    orderBy: buildProjectOrder(filters.sort),
  });

  return projects.map((project) => mapProject(project, filters.locale));
});

export const getProjectTechnologies = cache(async () => {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null, status: 'PUBLISHED' },
    select: { techStack: true },
  });

  const techSet = new Set<string>();
  projects.forEach((project) => {
    project.techStack?.forEach((tech) => techSet.add(tech));
  });

  return Array.from(techSet).sort((a, b) => a.localeCompare(b));
});

export const getProjectBySlug = cache(async (slug: string, locale: string) => {
  const project = await prisma.project.findFirst({
    where:
      locale === 'ar'
        ? { slugAr: slug, deletedAt: null }
        : { slugEn: slug, deletedAt: null },
    include: {
      images: true,
      projectClients: { include: { client: true } },
      category: true,
    },
  });

  if (!project) return null;

  return mapProject(project, locale);
});

export const getFeaturedProjects = cache(async (locale: string, take = 3) => {
  const projects = await prisma.project.findMany({
    where: { featured: true, status: 'PUBLISHED', deletedAt: null },
    include: {
      images: true,
      projectClients: { include: { client: true } },
      category: true,
    },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    take,
  });

  return projects.map((project) => mapProject(project, locale));
});

export type LocalizedAchievement = {
  id: string;
  title: string;
  description: string;
  issuer: string;
  achievedOn: string;
  linkUrl?: string | null;
  logoUrl?: string | null;
};

export const getRecentAchievements = cache(async (locale: string, take = 4) => {
  const achievements = await prisma.achievement.findMany({
    where: { deletedAt: null },
    orderBy: [{ achievedOn: 'desc' }],
    take,
  });

  return achievements.map((achievement) => ({
    id: achievement.id,
    title: localizeField(achievement, 'title', locale),
    description: localizeField(achievement, 'description', locale),
    issuer: localizeField(achievement, 'issuedBy', locale),
    achievedOn: achievement.achievedOn.toISOString(),
    linkUrl: achievement.linkUrl,
    logoUrl: achievement.logoUrl,
  }));
});

export type LocalizedEducation = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string | null;
  startDate: string;
  endDate: string | null;
  description?: string | null;
};

export const getEducationTimeline = cache(async (locale: string) => {
  const education = await prisma.education.findMany({
    orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
  });

  return education.map((item) => ({
    id: item.id,
    institution: localizeField(item, 'institution', locale),
    degree: localizeField(item, 'degree', locale),
    field: localizeField(item, 'field', locale),
    location:
      item.locationEn || item.locationAr
        ? localizeField(item, 'location', locale)
        : null,
    startDate: item.startDate.toISOString(),
    endDate: toISODate(item.endDate),
    description: item.descriptionEn ? localizeField(item, 'description', locale) : null,
  }));
});

type LocalizedExperience = {
  id: string;
  company: string;
  title: string;
  description: string;
  type: string;
  current: boolean;
  startDate: string;
  endDate: string | null;
};

export const getExperiences = cache(async (locale: string) => {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
  });

  return experiences.map((experience) => ({
    id: experience.id,
    company: localizeField(experience, 'company', locale),
    title: localizeField(experience, 'title', locale),
    description: localizeField(experience, 'description', locale),
    type: experience.type,
    current: experience.current,
    startDate: experience.startDate.toISOString(),
    endDate: toISODate(experience.endDate),
  }));
});

export type LocalizedCourse = {
  id: string;
  title: string;
  provider: string;
  issuedOn: string;
  certificateUrl?: string | null;
  notes?: string | null;
};

export const getCourses = cache(async (locale: string) => {
  const courses = await prisma.course.findMany({
    where: { deletedAt: null },
    orderBy: [{ issuedOn: 'desc' }],
  });

  return courses.map((course) => ({
    id: course.id,
    title: localizeField(course, 'title', locale),
    provider: localizeField(course, 'provider', locale),
    issuedOn: course.issuedOn.toISOString(),
    certificateUrl: course.certificateUrl,
    notes: course.notesEn ? localizeField(course, 'notes', locale) : null,
  }));
});

export type LocalizedClient = {
  id: string;
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  testimonial?: string | null;
};

export const getClients = cache(async (locale: string) => {
  const clients = await prisma.client.findMany({
    where: { deletedAt: null },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return clients.map((client) => ({
    id: client.id,
    name: localizeField(client, 'name', locale),
    logoUrl: client.logoUrl,
    websiteUrl: client.websiteUrl,
    testimonial: client.testimonialEn ? localizeField(client, 'testimonial', locale) : null,
  }));
});

export const getSettings = cache(async () => {
  return prisma.settings.findFirst();
});

export type PortfolioStats = {
  projects: number;
  clients: number;
  technologies: number;
  experienceYears: number;
};

function calculateExperienceYears(experiences: LocalizedExperience[]) {
  if (experiences.length === 0) return 0;
  const sorted = [...experiences].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const firstStart = new Date(sorted[0].startDate);
  const referenceEnd = sorted.reduce((latest, current) => {
    const endDate = current.endDate ? new Date(current.endDate) : new Date();
    return endDate > latest ? endDate : latest;
  }, new Date(firstStart));

  const diff = referenceEnd.getTime() - firstStart.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
}

export const getPortfolioStats = cache(async (locale: string): Promise<PortfolioStats> => {
  const [projects, clients, experiences] = await Promise.all([
    getProjectsForListing({ locale }),
    getClients(locale),
    getExperiences(locale),
  ]);

  const uniqueTechnologies = new Set<string>();
  projects.forEach((project) => {
    project.techStack.forEach((tech) => uniqueTechnologies.add(tech));
  });

  return {
    projects: projects.length,
    clients: clients.length,
    technologies: uniqueTechnologies.size,
    experienceYears: calculateExperienceYears(experiences),
  };
});
