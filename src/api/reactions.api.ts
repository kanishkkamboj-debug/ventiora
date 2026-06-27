import { apiClient } from './client';
import type { ReactRequest } from '../types/reaction.types';
export const reactionsApi = { react: (data: ReactRequest) => apiClient.post('/reactions', data), unreact: (data: ReactRequest) => apiClient.delete('/reactions', { data }) };
