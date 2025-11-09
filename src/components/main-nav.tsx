'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Menu, X } from 'lucide-react';

type NavItem = {
  href: string;
  labelKey: string;
};

const navItems: NavItem[] = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/about', labelKey: 'nav.about' },
  { href: '/projects', labelKey: 'nav.projects' },
  { href: '/achievements', labelKey: 'nav.achievements' },
  { href: '/education', labelKey: 'nav.education' },
  { href: '/courses', labelKey: 'nav.courses' },
  { href: '/clients', labelKey: 'nav.clients' },
  { href: '/contact', labelKey: 'nav.contact' },
];

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href={`/${locale}`} className="text-xl font-bold gradient-text">
            Portfolio
          </Link>
        </div>

        <Button
          variant="ghost"
          className="mr-2 px-0 md:hidden"
          onClick={toggleMenu}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div
          className={cn(
            'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background',
            {
              hidden: !isMenuOpen,
              'slide-in-from-left-80': locale === 'en',
              'slide-in-from-right-80': locale === 'ar',
            }
          )}
        >
          <div className="relative z-20 grid gap-6 rounded-md bg-background p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === `/${locale}${item.href}`
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
                onClick={toggleMenu}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex md:flex-1 md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'nav-link text-sm font-medium transition-colors',
                pathname === `/${locale}${item.href}`
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}