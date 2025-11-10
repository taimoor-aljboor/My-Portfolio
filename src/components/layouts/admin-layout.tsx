'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Command, GraduationCap, Grid, Image as ImageIcon, MessageSquare, Settings, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { UserNav } from '@/components/user-nav';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations();

  const navItems = [
    {
      href: '/admin',
      icon: Command,
      label: t('admin.nav.dashboard'),
    },
    {
      href: '/admin/profile',
      icon: UserCircle,
      label: t('admin.nav.profile'),
    },
    {
      href: '/admin/projects',
      icon: Grid,
      label: t('admin.nav.projects'),
    },
    {
      href: '/admin/clients',
      icon: Building2,
      label: t('admin.nav.clients'),
    },
    {
      href: '/admin/courses',
      icon: GraduationCap,
      label: t('admin.nav.courses'),
    },
    {
      href: '/admin/messages',
      icon: MessageSquare,
      label: t('admin.nav.messages'),
    },
    {
      href: '/admin/media',
      icon: ImageIcon,
      label: t('admin.nav.media'),
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: t('admin.nav.settings'),
    },
  ];

  const activeNavItem = navItems.find(({ href }) => pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r bg-muted/40">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Command className="h-6 w-6" />
            <span>Admin</span>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(({ href, icon: Icon, label }) => (
              <li key={href}>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2',
                    (pathname === href || pathname.startsWith(`${href}/`)) && 'bg-muted'
                  )}
                >
                  <Link href={href}>
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col">
        <header className="h-16 border-b px-6">
          <div className="flex h-full items-center justify-between">
            <h1 className="text-lg font-semibold">{activeNavItem?.label ?? t('admin.nav.dashboard')}</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSwitcher />
              <UserNav />
            </div>
          </div>
        </header>
        <div className="flex-1 space-y-4 p-8">{children}</div>
      </main>
    </div>
  );
}