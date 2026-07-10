/**
 * src/utils/anonymity.ts
 *
 * Single-source-of-truth utilities for resolving anonymous vs. named
 * display in post and comment UI.
 *
 * Design contract (enforced here, not scattered in every component):
 *   - `post.isAnonymous` / `comment.isAnonymous` is the ONLY flag that
 *     determines anonymity. Reading `author.isAnonymous` is a bug.
 *   - If `isAnonymous === true`, the frontend MUST render "Anonymous"
 *     regardless of what `author` contains. The DB view (`posts_public`,
 *     `comments_public`) is responsible for nulling out identity; the
 *     frontend adds a second line of defence here.
 *   - If the backend sends `{ user: User }` for an `isAnonymous === true`
 *     item, that is a backend anonymity leak. We log a dev-mode warning
 *     and still show "Anonymous" — we never render the leaked username.
 */

import type { PostAuthor } from '../types/user.types';

// ---------------------------------------------------------------------------
// Type guard: check whether author carries real user data
// ---------------------------------------------------------------------------

export function authorHasUser(author: PostAuthor): author is { user: import('../types/user.types').User } {
  return 'user' in author;
}

// ---------------------------------------------------------------------------
// resolveDisplayName
// ---------------------------------------------------------------------------

/**
 * Returns the display name for a post or comment author.
 *
 * @param isAnonymous - The top-level `post.isAnonymous` or `comment.isAnonymous`.
 * @param author - The `PostAuthor` union.
 * @param prefix - Prefix to add before non-anonymous usernames (default `'@'`).
 *
 * Security contract: if `isAnonymous` is `true` but `author` still carries
 * real user data, we emit a dev-mode console warning (backend anonymity leak)
 * and return `'Anonymous'` — the leaked username is never rendered.
 */
export function resolveDisplayName(
  isAnonymous: boolean,
  author: PostAuthor,
  prefix = '@',
): string {
  if (isAnonymous) {
    // Dev-mode leak detector — stripped from production builds by dead-code elimination
    if (import.meta.env.DEV && authorHasUser(author)) {
      console.warn(
        '[Ventiora] Anonymity leak detected: post/comment is marked isAnonymous=true ' +
        'but author.user is present. This is a backend bug. ' +
        `username="${author.user.username}". Rendering as Anonymous.`,
      );
    }
    return 'Anonymous';
  }

  if (authorHasUser(author)) {
    return `${prefix}${author.user.username}`;
  }

  // Structural mismatch: isAnonymous=false but no user data present.
  // This should never happen on a correctly-shaped API response.
  if (import.meta.env.DEV) {
    console.warn(
      '[Ventiora] Author shape mismatch: isAnonymous=false but author has no user. ' +
      'Rendering as Anonymous. Check the API response shape.',
    );
  }
  return 'Anonymous';
}

// ---------------------------------------------------------------------------
// resolveAvatarUrl — safe accessor for avatar; returns undefined for anon
// ---------------------------------------------------------------------------

/**
 * Safely returns the avatar URL for a non-anonymous author.
 * Returns `undefined` for anonymous authors (caller should show silhouette).
 */
export function resolveAvatarUrl(isAnonymous: boolean, author: PostAuthor): string | undefined {
  if (isAnonymous || !authorHasUser(author)) return undefined;
  return author.user.avatar_url ?? undefined;
}

// ---------------------------------------------------------------------------
// resolveUsername — safe accessor for username; returns undefined for anon
// ---------------------------------------------------------------------------

/**
 * Safely returns the raw username (no prefix) or `undefined` for anonymous authors.
 */
export function resolveUsername(isAnonymous: boolean, author: PostAuthor): string | undefined {
  if (isAnonymous || !authorHasUser(author)) return undefined;
  return author.user.username;
}
