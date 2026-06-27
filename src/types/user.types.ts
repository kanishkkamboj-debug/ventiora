import type { Role } from './common.types';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: Role;
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
  createdAt: string;
  postCount: number;
  commentCount: number;
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
