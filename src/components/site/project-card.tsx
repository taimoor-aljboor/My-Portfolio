import Link from 'next/link';
import Image from 'next/image';
import type { LocalizedProject } from '@/lib/queries/public';

type ProjectCardProps = {
  project: LocalizedProject;
  locale: string;
};

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const href = `/${locale}/projects/${project.slug}`;

  return (
    <article className="card-hover flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="relative h-48 w-full bg-muted">
        {project.heroImage ? (
          <Image
            src={project.heroImage}
            alt={project.heroAlt ?? project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority={project.featured}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {project.title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            <Link href={href} className="hover:text-primary">
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{project.shortDescription}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {project.techStack.slice(0, 6).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
