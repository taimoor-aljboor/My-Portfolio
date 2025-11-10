import type { ReactNode } from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Instagram, Youtube } from 'lucide-react';
import type { Settings } from '@prisma/client';
import type { LocalizedProfile } from '@/lib/queries/public';

type FooterProps = {
  locale: string;
  profile: LocalizedProfile | null;
  settings: Settings | null;
};

type SocialEntry = {
  href: string;
  label: string;
  icon: ReactNode;
};

const socialIconMap: Record<string, ReactNode> = {
  linkedin: <Linkedin className="h-4 w-4" />,
  github: <Github className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
};

function extractSocialLinks(profile: LocalizedProfile | null, t: (key: string) => string): SocialEntry[] {
  if (!profile?.socialLinks) return [];
  const entries: SocialEntry[] = [];
  const links = profile.socialLinks as Record<string, unknown>;

  const append = (key: string, label?: string) => {
    const value = links[key];
    if (!value) return;
    if (typeof value === 'string' && value.trim().length > 0) {
      entries.push({
        href: value,
        label: label ?? key,
        icon: socialIconMap[key] ?? <Globe className="h-4 w-4" />,
      });
    }
  };

  append('linkedin', 'LinkedIn');
  append('github', 'GitHub');
  append('instagram', 'Instagram');
  append('youtube', 'YouTube');
  append('website', t('footer.resources'));

  const other = links['other'];
  if (Array.isArray(other)) {
    other.forEach((value) => {
      if (typeof value === 'object' && value && 'url' in value) {
        const entry = value as { url: string; label?: string };
        if (entry.url) {
          entries.push({
            href: entry.url,
            label: entry.label ?? t('nav.contact'),
            icon: <Globe className="h-4 w-4" />,
          });
        }
      }
    });
  }

  return entries;
}

export async function Footer({ locale, profile, settings }: FooterProps) {
  const t = await getTranslations();
  const currentYear = new Date().getFullYear();
  const socialLinks = extractSocialLinks(profile, (key) => t(key));
  const siteName = settings?.siteNameEn ?? profile?.fullName ?? 'Portfolio';

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-base font-medium">{t('nav.navigation')}</h3>
            <ul className="space-y-2">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-medium">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              {profile?.cvPdfUrl ? (
                <li>
                  <a
                    href={profile.cvPdfUrl}
                    className="text-sm text-muted-foreground hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('footer.downloadCV')}
                  </a>
                </li>
              ) : null}
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-medium">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {profile?.email ? (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${profile.email}`} className="hover:text-primary">
                    {profile.email}
                  </a>
                </li>
              ) : null}
              {profile?.phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${profile.phone}`} className="hover:text-primary">
                    {profile.phone}
                  </a>
                </li>
              ) : null}
              {profile?.location ? (
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-medium">{t('footer.preferences')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {socialLinks.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary"
                  >
                    {social.icon}
                    {social.label}
                  </a>
                </li>
              ))}
              {socialLinks.length === 0 ? (
                <li>
                  {locale === 'en'
                    ? 'Follow updates on social media soon.'
                    : 'تابعني على الشبكات الاجتماعية قريبًا.'}
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t.rich('footer.copyright', { year: currentYear, name: siteName })}
          </p>
        </div>
      </div>
    </footer>
  );
}
