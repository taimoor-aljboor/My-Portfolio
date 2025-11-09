import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = 'en') {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

export function formatRelativeDate(date: Date | string, locale: string = 'en') {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return locale === 'ar' ? 'اليوم' : 'Today';
  } else if (diffInDays === 1) {
    return locale === 'ar' ? 'أمس' : 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} ${locale === 'ar' ? 'أيام' : 'days'} ${locale === 'ar' ? 'مضت' : 'ago'}`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${locale === 'ar' ? 'أسابيع' : 'weeks'} ${locale === 'ar' ? 'مضت' : 'ago'}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${locale === 'ar' ? 'أشهر' : 'months'} ${locale === 'ar' ? 'مضت' : 'ago'}`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} ${locale === 'ar' ? 'سنوات' : 'years'} ${locale === 'ar' ? 'مضت' : 'ago'}`;
  }
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function generateExcerpt(text: string, maxLength: number = 150) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string) {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}