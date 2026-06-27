import type { Role } from './common.types';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  role: Role;
  is_banned: boolean;
  is_suspended: boolean;
  created_at: string;
}

export interface AnonymousAuthor {
  isAnonymous: true;
  displayName: 'Anonymous';
}

export type PostAuthor =
  | { isAnonymous: false; user: User }
  | AnonymousAuthor;

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  avatarUrl?: string;
}
