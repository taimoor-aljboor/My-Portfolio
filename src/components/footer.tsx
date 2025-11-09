'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-base font-medium">{t('nav.navigation')}</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: t('nav.home') },
                { href: '/about', label: t('nav.about') },
                { href: '/projects', label: t('nav.projects') },
                { href: '/contact', label: t('nav.contact') },
              ].map((item) => (
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

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-base font-medium">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/cv`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t('footer.downloadCV')}
                </Link>
              </li>
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

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-base font-medium">{t('footer.contact')}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@example.com"
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  contact@example.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Language & Theme */}
          <div className="space-y-3">
            <h3 className="text-base font-medium">{t('footer.preferences')}</h3>
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? 'عربي متوفر' : 'English Available'}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t.rich('footer.copyright', { year: currentYear, name: 'Your Name' })}
          </p>
        </div>
      </div>
    </footer>
  );
}