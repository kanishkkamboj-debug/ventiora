import { mockComments } from '../utils/mockData';

export const commentsApi = {
  getByPost: async (postId: string) => {
    const comments = mockComments.filter(c => c.post_id === postId);
    return { data: { content: comments } };
  },
};
