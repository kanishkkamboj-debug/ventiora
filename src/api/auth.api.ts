import { apiClient } from './client';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (data: { username: string; email: string; password: string }) =>
    apiClient.post('/auth/register', data),

  logout: () => apiClient.post('/auth/logout'),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),

  me: () => apiClient.get('/auth/me'),
};
