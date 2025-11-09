'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLocale}
      title={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      className="relative"
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">
        {locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      </span>
      <span className="absolute -bottom-1 right-0 text-xs font-bold">
        {locale === 'en' ? 'ع' : 'En'}
      </span>
    </Button>
  );
}