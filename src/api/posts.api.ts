import { mockPosts } from '../utils/mockData';

export const postsApi = {
  getAll: async () => {
    return { data: { content: mockPosts } };
  },
  getById: async (id: string) => {
    const post = mockPosts.find(p => p.id === id);
    if (!post) throw new Error('Post not found');
    return { data: post };
  },
};
