/**
 * src/utils/date.test.ts
 *
 * Unit tests for the consolidated date utility (Prompt 09).
 *
 * Covers every exported function with the following time bands:
 *   - Invalid / null input  → safe fallback "—"
 *   - Just now              (< 60 s)
 *   - Minutes ago           (< 60 m)
 *   - Hours ago             (< 24 h)
 *   - Days ago              (< 7 d for formatTimeAgo, < 30 d for formatRelative)
 *   - Old content fallback  (≥ 7 d for formatTimeAgo, ≥ 30 d for formatRelative)
 *     → must render an absolute date, NOT "N days ago" (UX bug regression guard)
 *
 * All tests use vi.setSystemTime so the "now" is pinned for determinism.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatTimeAgo,
  formatRelative,
  formatShort,
  formatFull,
  toISOString,
  formatDistanceToNow,
} from './date';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns an ISO string that is `ms` milliseconds before the pinned "now". */
function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

const SEC  = 1000;
const MIN  = 60 * SEC;
const HOUR = 60 * MIN;
const DAY  = 24 * HOUR;

// ---------------------------------------------------------------------------
// Setup: pin Date.now so relative calculations are deterministic
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Pin to a stable Thursday 2026-01-15 12:00:00 UTC
  vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// formatTimeAgo
// ---------------------------------------------------------------------------

describe('formatTimeAgo', () => {
  it('returns "—" for null', () => {
    expect(formatTimeAgo(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatTimeAgo(undefined)).toBe('—');
  });

  it('returns "—" for an invalid date string', () => {
    expect(formatTimeAgo('not-a-date')).toBe('—');
  });

  it('returns "Just now" for < 60 s ago', () => {
    expect(formatTimeAgo(ago(30 * SEC))).toBe('Just now');
  });

  it('returns "Nm ago" for minutes (e.g. 5m ago)', () => {
    expect(formatTimeAgo(ago(5 * MIN))).toBe('5m ago');
  });

  it('returns "Nh ago" for hours (e.g. 3h ago)', () => {
    expect(formatTimeAgo(ago(3 * HOUR))).toBe('3h ago');
  });

  it('returns "Nd ago" for days within 7 days (e.g. 4d ago)', () => {
    expect(formatTimeAgo(ago(4 * DAY))).toBe('4d ago');
  });

  it('returns absolute date (not "Nd ago") for content older than 7 days — UX regression guard', () => {
    const result = formatTimeAgo(ago(10 * DAY));
    // Must NOT contain "d ago", "h ago", "m ago", or "Just now"
    expect(result).not.toMatch(/\d+[dhm] ago|Just now/);
    // Must look like a date (contains a digit and a letter — e.g. "Jan 5, 2026")
    expect(result).toMatch(/\w+ \d+, \d{4}/);
  });

  it('accepts a Date object (backward compat)', () => {
    const d = new Date(Date.now() - 10 * MIN);
    expect(formatTimeAgo(d)).toBe('10m ago');
  });
});

// ---------------------------------------------------------------------------
// formatDistanceToNow (deprecated re-export backward compat)
// ---------------------------------------------------------------------------

describe('formatDistanceToNow (deprecated re-export)', () => {
  it('behaves identically to formatTimeAgo for a Date object', () => {
    const d = new Date(Date.now() - 45 * MIN);
    expect(formatDistanceToNow(d)).toBe('45m ago');
  });

  it('returns "—" for null', () => {
    expect(formatDistanceToNow(null)).toBe('—');
  });
});

// ---------------------------------------------------------------------------
// formatRelative
// ---------------------------------------------------------------------------

describe('formatRelative', () => {
  it('returns "—" for null', () => {
    expect(formatRelative(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatRelative(undefined)).toBe('—');
  });

  it('returns "—" for an invalid date string', () => {
    expect(formatRelative('garbage')).toBe('—');
  });

  it('returns a seconds-level phrase for < 60 s ago', () => {
    const result = formatRelative(ago(20 * SEC));
    expect(result).toMatch(/second|now/i);
  });

  it('returns a minutes phrase for ~5 minutes ago', () => {
    const result = formatRelative(ago(5 * MIN));
    expect(result).toMatch(/minute/i);
  });

  it('returns an hours phrase for ~3 hours ago', () => {
    const result = formatRelative(ago(3 * HOUR));
    expect(result).toMatch(/hour/i);
  });

  it('returns a days phrase for ~4 days ago', () => {
    const result = formatRelative(ago(4 * DAY));
    expect(result).toMatch(/day/i);
  });

  it('returns absolute date (not "N days ago") for content ≥ 30 days — UX regression guard', () => {
    // 400 days ago: old content must show a real date, not "400 days ago"
    const result = formatRelative(ago(400 * DAY));
    expect(result).not.toMatch(/\d+ days? ago|\d+ months? ago|\d+ years? ago/i);
    expect(result).toMatch(/\w+ \d+, \d{4}/);
  });
});

// ---------------------------------------------------------------------------
// formatShort
// ---------------------------------------------------------------------------

describe('formatShort', () => {
  it('returns "—" for null', () => {
    expect(formatShort(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatShort(undefined)).toBe('—');
  });

  it('returns "—" for an invalid date string', () => {
    expect(formatShort('nope')).toBe('—');
  });

  it('formats a known date as short (e.g. "Jan 15, 2026")', () => {
    expect(formatShort('2026-01-15T12:00:00Z')).toMatch(/Jan 15, 2026/);
  });

  it('contains the year, abbreviated month, and day', () => {
    const result = formatShort('2026-06-01T00:00:00Z');
    expect(result).toMatch(/\d{4}/);   // year
    expect(result).toMatch(/[A-Z][a-z]+/); // month abbrev
    expect(result).toMatch(/\d+/);         // day
  });
});

// ---------------------------------------------------------------------------
// formatFull
// ---------------------------------------------------------------------------

describe('formatFull', () => {
  it('returns "—" for null', () => {
    expect(formatFull(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatFull(undefined)).toBe('—');
  });

  it('returns "—" for an invalid date string', () => {
    expect(formatFull('bad')).toBe('—');
  });

  it('contains the full month name, day, year, and a time component', () => {
    const result = formatFull('2026-01-15T12:00:00Z');
    expect(result).toMatch(/January/i);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2026/);
    // Should include AM/PM hour:minute
    expect(result).toMatch(/\d+:\d+ [AP]M/i);
  });
});

// ---------------------------------------------------------------------------
// toISOString
// ---------------------------------------------------------------------------

describe('toISOString', () => {
  it('returns "" for null', () => {
    expect(toISOString(null)).toBe('');
  });

  it('returns "" for undefined', () => {
    expect(toISOString(undefined)).toBe('');
  });

  it('returns "" for an invalid date string', () => {
    expect(toISOString('invalid')).toBe('');
  });

  it('returns a valid ISO 8601 string for a valid input', () => {
    const result = toISOString('2026-01-15T12:00:00Z');
    expect(result).toBe('2026-01-15T12:00:00.000Z');
  });

  it('accepts a Date object and returns ISO string', () => {
    const d = new Date('2026-06-01T00:00:00Z');
    expect(toISOString(d)).toBe('2026-06-01T00:00:00.000Z');
  });
});
