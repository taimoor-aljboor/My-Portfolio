import type { ReactNode, CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/lib/theme-provider';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';
import { getPublicProfile, getSettings } from '@/lib/queries/public';
import { hexToCssHsl } from '@/lib/utils/color';
import { AnalyticsScripts } from '@/components/analytics-scripts';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  const [messages, profile, settings] = await Promise.all([
    getMessages(),
    getPublicProfile(locale),
    getSettings(),
  ]);

  const primaryHsl = settings
    ? hexToCssHsl(settings.primaryColor, '221.2 83.2% 53.3%')
    : '221.2 83.2% 53.3%';
  const accentHsl = settings
    ? hexToCssHsl(settings.accentColor, '160 84% 39%')
    : '160 84% 39%';

  const cssVariables: CSSProperties = {
    '--primary': primaryHsl,
    '--accent': accentHsl,
  } as CSSProperties;

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" style={cssVariables}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="relative flex min-h-screen flex-col">
              <MainNav />
              <main className="flex-1">{children}</main>
              <Footer locale={locale} profile={profile} settings={settings ?? null} />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
        <AnalyticsScripts analyticsId={settings?.googleAnalyticsId ?? null} />
      </body>
    </html>
  );
}
