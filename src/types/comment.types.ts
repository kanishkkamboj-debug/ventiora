import type { PostAuthor } from './user.types';

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: PostAuthor;
  isAnonymous: boolean;
  parentId?: string;
  replies?: Comment[];
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
  isAnonymous: boolean;
  parentId?: string;
}
