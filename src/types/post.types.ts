import type { PostAuthor } from './user.types';
import type { Category, Tag } from './category.types';
import type { ReactionType } from './reaction.types';

export type SortMode = 'TRENDING' | 'NEW' | 'TOP';

export interface PostFilters {
  categoryId?: string;
  tagId?: string;
  sortMode?: SortMode;
  search?: string;
  page?: number;
  size?: number;
}

export interface ReactionCount {
  type: ReactionType;
  count: number;
  reacted: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: PostAuthor;
  category: Category;
  tags: Tag[];
  isAnonymous: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  isLocked: boolean;
  viewCount: number;
  commentCount: number;
  reactions: ReactionCount[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  isAnonymous: boolean;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {}
