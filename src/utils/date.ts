/**
 * src/utils/date.ts
 *
 * Single date-formatting module for the entire app.
 *
 * Consolidated from two redundant files (Prompt 09):
 *   - date.ts       → formatDistanceToNow (compact relative)
 *   - dateFormat.ts → formatRelative, formatShort, formatFull
 *
 * Function guide:
 *   formatTimeAgo(isoString)  — compact abbreviation: "3m ago", "2h ago", "5d ago",
 *                               falls back to formatShort for dates older than 7 days.
 *   formatRelative(isoString) — full Intl phrase: "3 minutes ago", "2 months ago",
 *                               falls back to formatShort for dates older than 30 days
 *                               (fixes "1042 days ago" UX bug for old content).
 *   formatShort(isoString)    — absolute short: "Jul 10, 2026"
 *   formatFull(isoString)     — absolute full: "July 10, 2026, 05:30 PM"
 *
 * All functions:
 *   - Accept ISO 8601 strings or a Date object where noted.
 *   - Return a safe fallback string on invalid / null input (never throw).
 *   - Do all arithmetic in milliseconds (UTC), format in the user's local timezone.
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;

function parseSafe(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

// ---------------------------------------------------------------------------
// formatTimeAgo
// ---------------------------------------------------------------------------

/**
 * Returns a compact relative-time abbreviation.
 *
 * - < 60 s  → "Just now"
 * - < 1 h   → "Nm ago"
 * - < 24 h  → "Nh ago"
 * - < 7 d   → "Nd ago"
 * - ≥ 7 d   → formatShort (absolute date, avoids "42d ago" for old posts)
 *
 * @param date ISO string OR Date object
 * @returns Compact string; "—" on invalid/null input
 */
export function formatTimeAgo(date: string | Date | null | undefined): string {
  const d = parseSafe(date);
  if (!d) return '—';

  const diffMs = Date.now() - d.getTime();

  if (diffMs < MINUTE)     return 'Just now';
  if (diffMs < HOUR)       return `${Math.floor(diffMs / MINUTE)}m ago`;
  if (diffMs < DAY)        return `${Math.floor(diffMs / HOUR)}h ago`;
  if (diffMs < 7 * DAY)   return `${Math.floor(diffMs / DAY)}d ago`;

  // Older than a week → show the actual date
  return formatShort(d.toISOString());
}

/**
 * @deprecated Use `formatTimeAgo` instead.
 * Re-exported for backward compatibility with existing callers.
 * Accepts a `Date` object to match the old API.
 */
export function formatDistanceToNow(date: Date | null | undefined): string {
  return formatTimeAgo(date ?? undefined);
}

// ---------------------------------------------------------------------------
// formatRelative
// ---------------------------------------------------------------------------

/**
 * Returns a full natural-language relative time string using Intl.RelativeTimeFormat.
 *
 * - < 60 s   → "N seconds ago" (or "just now" for < 5 s)
 * - < 60 m   → "N minutes ago"
 * - < 24 h   → "N hours ago"
 * - < 30 d   → "N days ago"
 * - ≥ 30 d   → formatShort (absolute date — prevents "365 days ago" for old content)
 *
 * @param date ISO string
 * @returns Natural-language string; "—" on invalid/null input
 */
export function formatRelative(date: string | null | undefined): string {
  const d = parseSafe(date);
  if (!d) return '—';

  const diffMs  = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / SECOND);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffSec < 60)  return rtf.format(-diffSec, 'second');

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60)  return rtf.format(-diffMin, 'minute');

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)   return rtf.format(-diffHr, 'hour');

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30)  return rtf.format(-diffDay, 'day');

  // ≥ 30 days — show actual date to avoid "365 days ago" UX regression
  return formatShort(d.toISOString());
}

// ---------------------------------------------------------------------------
// formatShort
// ---------------------------------------------------------------------------

/**
 * Returns a short absolute date: "Jul 10, 2026".
 *
 * @param date ISO string
 * @returns Short date string; "—" on invalid/null input
 */
export function formatShort(date: string | null | undefined): string {
  const d = parseSafe(date);
  if (!d) return '—';

  return new Intl.DateTimeFormat('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  }).format(d);
}

// ---------------------------------------------------------------------------
// formatFull
// ---------------------------------------------------------------------------

/**
 * Returns a full absolute datetime: "July 10, 2026, 05:30 PM".
 *
 * @param date ISO string
 * @returns Full datetime string; "—" on invalid/null input
 */
export function formatFull(date: string | null | undefined): string {
  const d = parseSafe(date);
  if (!d) return '—';

  return new Intl.DateTimeFormat('en-US', {
    year:   'numeric',
    month:  'long',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(d);
}

// ---------------------------------------------------------------------------
// toISOString — safe accessor for use in <time dateTime={...}>
// ---------------------------------------------------------------------------

/**
 * Returns the ISO 8601 string for a date, for use in `<time dateTime={...}>`.
 * Returns an empty string on invalid input (so the attribute is set but empty,
 * rather than crashing).
 */
export function toISOString(date: string | Date | null | undefined): string {
  const d = parseSafe(date);
  return d ? d.toISOString() : '';
}
