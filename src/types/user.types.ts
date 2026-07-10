import type { Role } from './common.types';

export interface User {
  id: string;
  username: string;
  email: string; // private
  phone?: string; // private
  dob?: string; // private
  avatar_url?: string;
  bio?: string;
  interests?: string[];
  age_range?: string;
  gender?: string;
  role: Role;
  is_banned: boolean;
  is_suspended: boolean;
  created_at: string;
}

/**
 * An anonymous placeholder — carries no identifying user information.
 * The single source of truth for anonymity is the top-level
 * `post.isAnonymous` / `comment.isAnonymous` field.
 * The `author` field is a structural union whose shape reflects
 * only *what data is present*, not the anonymity decision itself.
 *
 * The `isAnonymous` discriminant was deliberately removed from both
 * union arms in Prompt 08. Use `post.isAnonymous` at the call site.
 */
export interface AnonymousAuthor {
  displayName: 'Anonymous';
}

/**
 * PostAuthor is now a plain union with no embedded anonymity flag.
 *
 * - `{ user: User }` — real author data is present.
 * - `{ displayName: 'Anonymous' }` — the DB view nulled out author identity;
 *   only the placeholder display name is available.
 *
 * To determine whether a post/comment is anonymous, read the top-level
 * `isAnonymous` boolean. Never rely on the shape of `author` alone.
 */
export type PostAuthor =
  | { user: User }
  | AnonymousAuthor;

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  avatarUrl?: string;
  interests?: string[];
  ageRange?: string;
  gender?: string;
  phone?: string;
  dob?: string;
}
