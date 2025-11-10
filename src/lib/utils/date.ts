export function formatDateRange(locale: string, start: string, end: string | null, presentLabel?: string) {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' });
  const startDate = formatter.format(new Date(start));
  const endDate = end ? formatter.format(new Date(end)) : presentLabel ?? 'Present';
  return `${startDate} – ${endDate}`;
}
