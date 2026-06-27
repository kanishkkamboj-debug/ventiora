/**
 * Formats a date string as a relative time (e.g., "2 hours ago").
 */
export function formatRelative(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return rtf.format(-diffHr, 'hour');
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return rtf.format(-diffDay, 'day');
  const diffMon = Math.floor(diffDay / 30);
  if (diffMon < 12) return rtf.format(-diffMon, 'month');
  const diffYr = Math.floor(diffMon / 12);
  return rtf.format(-diffYr, 'year');
}

/**
 * Formats a date string as a full human-readable date and time.
 */
export function formatFull(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Formats a date string as a short date (e.g., "Jun 26, 2026").
 */
export function formatShort(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}
