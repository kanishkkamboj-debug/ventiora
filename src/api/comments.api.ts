import { apiClient } from './client';
import type { CreateCommentRequest } from '../types/comment.types';

export const commentsApi = {
  getByPost: (postId: string) => apiClient.get(`/posts/${postId}/comments`),
  create: (data: CreateCommentRequest) => apiClient.post('/comments', data),
  delete: (id: string) => apiClient.delete(`/comments/${id}`),
};
