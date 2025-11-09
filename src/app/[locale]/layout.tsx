import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ThemeProvider } from '@/lib/theme-provider';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';

// This function returns the list of supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

// Layout component for the localized pages
export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  // Ensure that the incoming `locale` is valid
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <div className="relative flex min-h-screen flex-col">
              <MainNav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}