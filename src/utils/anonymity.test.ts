/**
 * src/utils/anonymity.test.ts
 *
 * Unit tests for the anonymity utility (Prompt 08).
 *
 * Verifies:
 *  1. resolveDisplayName: named and anonymous paths, prefix customisation
 *  2. resolveDisplayName: dev-mode console warning on backend anonymity leak
 *  3. resolveDisplayName: structural mismatch (isAnonymous=false, no user)
 *  4. resolveAvatarUrl: returns avatar for named, undefined for anonymous
 *  5. resolveUsername: returns username for named, undefined for anonymous
 *  6. authorHasUser: correct type-guard behaviour
 *
 * These tests use the single top-level flag pattern introduced in Prompt 08.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  resolveDisplayName,
  resolveAvatarUrl,
  resolveUsername,
  authorHasUser,
} from './anonymity';
import type { PostAuthor, User } from '../types/user.types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MOCK_USER: User = {
  id: 'u1',
  username: 'alice',
  email: 'alice@uni.edu',
  avatar_url: 'https://cdn.test/alice.jpg',
  role: 'STUDENT',
  is_banned: false,
  is_suspended: false,
  created_at: '2024-01-01T00:00:00Z',
};

const NAMED_AUTHOR: PostAuthor = { user: MOCK_USER };
const ANON_AUTHOR: PostAuthor = { displayName: 'Anonymous' };

// ---------------------------------------------------------------------------
// authorHasUser
// ---------------------------------------------------------------------------

describe('authorHasUser', () => {
  it('returns true when author contains a user object', () => {
    expect(authorHasUser(NAMED_AUTHOR)).toBe(true);
  });

  it('returns false for anonymous author (no user field)', () => {
    expect(authorHasUser(ANON_AUTHOR)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// resolveDisplayName — named author
// ---------------------------------------------------------------------------

describe('resolveDisplayName — named author (isAnonymous=false)', () => {
  it('returns "@username" with default @ prefix for non-anonymous posts', () => {
    expect(resolveDisplayName(false, NAMED_AUTHOR)).toBe('@alice');
  });

  it('returns username without prefix when prefix="" is passed', () => {
    expect(resolveDisplayName(false, NAMED_AUTHOR, '')).toBe('alice');
  });

  it('returns username with custom prefix', () => {
    expect(resolveDisplayName(false, NAMED_AUTHOR, '→ ')).toBe('→ alice');
  });
});

// ---------------------------------------------------------------------------
// resolveDisplayName — anonymous author
// ---------------------------------------------------------------------------

describe('resolveDisplayName — anonymous author (isAnonymous=true)', () => {
  it('returns "Anonymous" for anonymous content regardless of author shape', () => {
    expect(resolveDisplayName(true, ANON_AUTHOR)).toBe('Anonymous');
  });

  it('returns "Anonymous" even when prefix is customised', () => {
    expect(resolveDisplayName(true, ANON_AUTHOR, '')).toBe('Anonymous');
  });
});

// ---------------------------------------------------------------------------
// resolveDisplayName — dev-mode anonymity leak detection
// ---------------------------------------------------------------------------

describe('resolveDisplayName — backend anonymity leak (isAnonymous=true, author has user)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('still returns "Anonymous" when backend leaks user data on an anon post', () => {
    // This simulates a backend bug: isAnonymous=true but author.user is present
    const leaked = resolveDisplayName(true, NAMED_AUTHOR);
    expect(leaked).toBe('Anonymous');
  });

  it('emits a console.warn in dev mode when the leak is detected', () => {
    resolveDisplayName(true, NAMED_AUTHOR);
    // In test (import.meta.env.DEV is true in Vitest), the warning fires
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Anonymity leak detected'),
    );
  });

  it('includes the leaked username in the warning so it is identifiable in logs', () => {
    resolveDisplayName(true, NAMED_AUTHOR);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('alice'),
    );
  });
});

// ---------------------------------------------------------------------------
// resolveDisplayName — structural mismatch (isAnonymous=false, no user)
// ---------------------------------------------------------------------------

describe('resolveDisplayName — structural mismatch (isAnonymous=false, author has no user)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('returns "Anonymous" defensively when isAnonymous=false but author has no user', () => {
    // Passing anonymous author shape but saying isAnonymous=false — API mismatch
    const result = resolveDisplayName(false, ANON_AUTHOR);
    expect(result).toBe('Anonymous');
  });

  it('emits a console.warn for the shape mismatch', () => {
    resolveDisplayName(false, ANON_AUTHOR);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Author shape mismatch'),
    );
  });
});

// ---------------------------------------------------------------------------
// resolveAvatarUrl
// ---------------------------------------------------------------------------

describe('resolveAvatarUrl', () => {
  it('returns avatar_url for a non-anonymous named author', () => {
    expect(resolveAvatarUrl(false, NAMED_AUTHOR)).toBe('https://cdn.test/alice.jpg');
  });

  it('returns undefined when avatar_url is absent on a named author', () => {
    const noAvatar: PostAuthor = { user: { ...MOCK_USER, avatar_url: undefined } };
    expect(resolveAvatarUrl(false, noAvatar)).toBeUndefined();
  });

  it('returns undefined for anonymous content regardless of author shape', () => {
    expect(resolveAvatarUrl(true, ANON_AUTHOR)).toBeUndefined();
  });

  it('returns undefined when isAnonymous=true even if NAMED_AUTHOR is passed (leak guard)', () => {
    expect(resolveAvatarUrl(true, NAMED_AUTHOR)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// resolveUsername
// ---------------------------------------------------------------------------

describe('resolveUsername', () => {
  it('returns username for a non-anonymous named author', () => {
    expect(resolveUsername(false, NAMED_AUTHOR)).toBe('alice');
  });

  it('returns undefined for anonymous content', () => {
    expect(resolveUsername(true, ANON_AUTHOR)).toBeUndefined();
  });

  it('returns undefined when isAnonymous=true even if NAMED_AUTHOR is passed (leak guard)', () => {
    expect(resolveUsername(true, NAMED_AUTHOR)).toBeUndefined();
  });

  it('returns undefined for anonymous author with isAnonymous=false (structural mismatch)', () => {
    expect(resolveUsername(false, ANON_AUTHOR)).toBeUndefined();
  });
});
