import { apiClient } from './client';
import type { PostFilters, CreatePostRequest, UpdatePostRequest } from '../types/post.types';

export const postsApi = {
  getAll: (filters: PostFilters = {}) => apiClient.get('/posts', { params: filters }),
  getById: (id: string) => apiClient.get(`/posts/${id}`),
  create: (data: CreatePostRequest) => apiClient.post('/posts', data),
  update: (id: string, data: UpdatePostRequest) => apiClient.put(`/posts/${id}`, data),
  delete: (id: string) => apiClient.delete(`/posts/${id}`),
  pin: (id: string) => apiClient.post(`/posts/${id}/pin`),
  feature: (id: string) => apiClient.post(`/posts/${id}/feature`),
  lock: (id: string) => apiClient.post(`/posts/${id}/lock`),
};
